import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import ModalMultipleSelection from '@/src/components/ModalMultipleSelection';
import ModalSingleSelection from '@/src/components/ModalSingleSelection';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '@/src/components/ui/checkbox';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/src/components/ui/form-control';
import { Input, InputField } from '@/src/components/ui/input';
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from '@/src/components/ui/radio';
import { Text } from '@/src/components/ui/text';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import {
  IMAGE_UPLOAD_ENABLED,
  MAX_NEIGHBORHOODS,
  SCHEDULE_ENABLED,
} from '@/src/constants/Config';
import {
  specialties,
  genders,
  hourOptions,
} from '@/src/constants/ItemsSelection';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import {
  useApiDelete,
  useApiGet,
  useApiPatch,
  useApiPost,
} from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { useFormValidation } from '@/src/hooks/useFormValidation';
import type { FormFields } from '@/src/hooks/useFormValidation';
import { useProfileCompletion } from '@/src/hooks/useProfileCompletion';
import {
  type ScheduleResponse,
  type ScheduleRequest,
  type WeekSchedule,
  type UserPictureResponse,
  type UserRequest,
  type UserResponse,
  type UserResponseData,
  type UserSpecialtyResponse,
  type UserSpecialtyRequest,
  type StateAndCityResponse,
  Modality,
  UserType,
  Days,
} from '@/src/types/api';
import type { OptionItem } from '@/src/types/ui';
import {
  buildAvatarFormData,
  buildEditPayload,
  buildInvalidFieldError,
  buildRequiredFieldError,
  getModality,
  getSafeAvatarUri,
  pickImage,
} from '@/src/utils/helpers';
import {
  emptyWeekSchedule,
  formatCnpj,
  formatDate,
  formatPhone,
  handleCnpjChange,
  handlePhoneChange,
  mapImageRights,
  mapWeekDay,
  validateBirthday,
  validateCnpj,
  validateEmail,
  validatePhone,
} from '@/src/utils/masks';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { ImagePickerAsset } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import {
  FileText,
  Bookmark,
  BriefcaseBusiness,
  CircleIcon,
  CheckIcon,
  XIcon,
  AlertCircleIcon,
  Pencil,
  PlusIcon,
  MinusIcon,
  Trash,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Toast } from 'toastify-react-native';

type EditProfileValidationContext = {
  type: UserType;
  state: string;
  modality: Modality[];
};

export default function EditProfileScreen() {
  const params = useLocalSearchParams();
  const { logout, updateUser } = useAuth();
  const colors = useColors();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(
    null,
  );
  const [schedule, setSchedule] =
    useState<Record<Days, { from: string; to: string }>>(emptyWeekSchedule());

  // Keep initial values to detect which days were changed
  const initialScheduleRef =
    useRef<Record<Days, { from: string; to: string }>>(emptyWeekSchedule());

  // Parse the profile data from params if available
  const profile = params.profile
    ? (JSON.parse(params.profile as string) as UserResponseData)
    : null;

  const { markProfileAsCompleted } = useProfileCompletion(profile?.id);

  // Early return if no profile data
  useEffect(() => {
    if (!profile) {
      console.error('No profile data provided in params');
      Toast.show({
        type: 'error',
        text1: Strings.edit.toast.errorTitle,
        text2: Strings.edit.toast.errorDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
      router.back();
    }
  }, [profile]);

  // Mark profile as completed for non-interpreter users when they access edit screen
  useEffect(() => {
    if (profile && profile.type !== UserType.INTERPRETER) {
      markProfileAsCompleted();
    }
  }, [profile, profile?.type, markProfileAsCompleted]);

  const scheduleData = useMemo(
    () =>
      SCHEDULE_ENABLED && params.schedule
        ? (JSON.parse(params.schedule as string) as WeekSchedule)
        : emptyWeekSchedule(),
    [params.schedule],
  );

  useEffect(() => {
    setSchedule(scheduleData);
    initialScheduleRef.current = JSON.parse(JSON.stringify(scheduleData));
  }, [scheduleData]);

  const scheduleIds = useMemo(() => {
    const ids = {} as Record<Days, string | null>;
    (Object.keys(Days) as Days[]).forEach((day) => {
      ids[day] = (scheduleData as any)?.[day]?.id ?? null;
    });
    return ids;
  }, [scheduleData]);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 1);
    return d;
  }, []);

  // API hooks for different user types
  const personApi = useApiPatch<UserResponse, UserRequest>(
    ApiRoutes.person.profile(profile?.id || ''),
  );
  const enterpriseApi = useApiPatch<UserResponse, UserRequest>(
    ApiRoutes.enterprises.profile(profile?.id || ''),
  );
  const interpreterApi = useApiPatch<UserResponse, UserRequest>(
    ApiRoutes.interpreters.profile(profile?.id || ''),
  );
  const userSpecialtyApi = useApiPost<
    UserSpecialtyResponse,
    UserSpecialtyRequest
  >(ApiRoutes.userSpecialties.byUser(profile?.id || ''));
  const userPictureApi = useApiPost<UserPictureResponse, FormData>(
    ApiRoutes.userPicture.upload(profile?.id || ''),
  );
  const userPictureDeleteApi = useApiDelete<void>(
    ApiRoutes.userPicture.upload(profile?.id || ''),
  );
  const scheduleApiPatch = useApiPatch<ScheduleResponse, ScheduleRequest>('');
  const scheduleApiPost = useApiPost<ScheduleResponse, ScheduleRequest>(
    ApiRoutes.schedules.register,
  );

  // Forms validation - verify each field based on user type
  const { fields, setValue, validateForm, clearErrors } = useFormValidation<
    FormFields<EditProfileValidationContext>,
    EditProfileValidationContext
  >({
    name: {
      value: profile?.type !== UserType.ENTERPRISE ? profile?.name : '',
      error: '',
      validate: (
        value: string,
        ctx?: EditProfileValidationContext,
      ): string | null =>
        ctx?.type !== UserType.ENTERPRISE && value.trim().length < 5
          ? buildRequiredFieldError('name')
          : null,
    },
    reason: {
      value:
        profile?.type === UserType.ENTERPRISE ? profile?.corporate_reason : '',
      error: '',
      validate: (value: string, ctx?: { type: string }): string | null =>
        ctx?.type === UserType.ENTERPRISE && !value.trim()
          ? buildRequiredFieldError('reason')
          : null,
    },
    cnpj: {
      value:
        profile?.type === UserType.ENTERPRISE
          ? formatCnpj(profile?.cnpj)
          : profile?.type === UserType.INTERPRETER
            ? formatCnpj(profile?.professional_data?.cnpj)
            : '',
      error: '',
      validate: (value: string, ctx?: { type: string }): string | null => {
        if (ctx?.type === UserType.ENTERPRISE && !value.trim())
          return buildRequiredFieldError('cnpj');
        if (ctx?.type === UserType.ENTERPRISE && !validateCnpj(value))
          return buildInvalidFieldError('cnpj');
        if (
          ctx?.type === UserType.INTERPRETER &&
          value.trim() &&
          !validateCnpj(value)
        )
          return buildInvalidFieldError('cnpj');
        return null;
      },
    },
    birthday: {
      value:
        profile?.type !== UserType.ENTERPRISE
          ? formatDate(profile?.birthday)
          : '',
      error: '',
      validate: (
        value: string,
        ctx?: EditProfileValidationContext,
      ): string | null => {
        if (
          (ctx?.type === UserType.PERSON ||
            ctx?.type === UserType.INTERPRETER) &&
          !value.trim()
        )
          return buildRequiredFieldError('birthday');
        if (
          (ctx?.type === UserType.PERSON ||
            ctx?.type === UserType.INTERPRETER) &&
          !validateBirthday(value)
        )
          return buildInvalidFieldError('birthday');
        return null;
      },
    },
    gender: {
      value: profile?.type !== UserType.ENTERPRISE ? profile?.gender : '',
      error: '',
      validate: (
        value: string,
        ctx?: EditProfileValidationContext,
      ): string | null =>
        (ctx?.type === UserType.PERSON || ctx?.type === UserType.INTERPRETER) &&
        !value.trim()
          ? buildRequiredFieldError('gender')
          : null,
    },
    phone: {
      value: formatPhone(profile?.phone) || '',
      error: '',
      validate: (value: string): string | null => {
        if (!value.trim()) return buildRequiredFieldError('phone');
        if (!validatePhone(value)) return buildInvalidFieldError('phone');
        return null;
      },
    },
    email: {
      value: profile?.email || '',
      error: '',
      validate: (value: string): string | null => {
        if (!value.trim()) return buildRequiredFieldError('email');
        if (!validateEmail(value)) return buildInvalidFieldError('email');
        return null;
      },
    },
    selectedSpecialties: {
      value: profile?.specialties?.map((item) => item.id) ?? [],
      error: '',
      validate: (
        value: string[],
        ctx?: EditProfileValidationContext,
      ): string | null =>
        ctx?.type === UserType.INTERPRETER && (!value || value.length === 0)
          ? buildRequiredFieldError('specialties')
          : null,
    },
    description: {
      value:
        profile?.type === UserType.INTERPRETER
          ? profile?.professional_data?.description
          : '',
      error: '',
      validate: (
        value: string,
        ctx?: EditProfileValidationContext,
      ): string | null => {
        if (ctx?.type === UserType.INTERPRETER && !value.trim())
          return buildRequiredFieldError('more');
        return null;
      },
    },
    modality: {
      value:
        profile?.type === UserType.INTERPRETER
          ? getModality(profile?.professional_data?.modality)
          : [],
      error: '',
      validate: (
        value: Modality[],
        ctx?: EditProfileValidationContext,
      ): string | null =>
        ctx?.type === UserType.INTERPRETER && (!value || value.length === 0)
          ? buildRequiredFieldError('modality')
          : null,
    },
    state: {
      value:
        profile?.type === UserType.INTERPRETER
          ? profile?.locations?.[0]?.uf || ''
          : '',
      error: '',
      validate: (
        value: string,
        ctx?: EditProfileValidationContext,
      ): string | null => {
        return ctx?.type === UserType.INTERPRETER &&
          ctx?.modality.includes(Modality.PERSONALLY) &&
          !value.trim()
          ? buildRequiredFieldError('state')
          : null;
      },
    },
    city: {
      value:
        profile?.type === UserType.INTERPRETER
          ? profile?.locations?.[0]?.city || ''
          : '',
      error: '',
      validate: (
        value: string,
        ctx?: EditProfileValidationContext,
      ): string | null =>
        ctx?.type === UserType.INTERPRETER &&
        ctx?.modality.includes(Modality.PERSONALLY) &&
        !value.trim()
          ? buildRequiredFieldError('city')
          : null,
    },
    neighborhoods: {
      value:
        profile?.type === UserType.INTERPRETER
          ? profile?.locations?.map((l) => l.neighborhood) || ['']
          : [''],
      error: '',
      validate: (
        value: string[],
        ctx?: EditProfileValidationContext,
      ): string | null =>
        ctx?.type === UserType.INTERPRETER &&
        ctx?.modality.includes(Modality.PERSONALLY) &&
        (!value || value.length === 0 || value.some((v) => !v.trim()))
          ? buildRequiredFieldError('neighborhoods')
          : null,
    },
    imageRight: {
      value:
        profile?.type === UserType.INTERPRETER
          ? mapImageRights(profile?.professional_data?.image_rights)
          : '',
      error: '',
      validate: (_value: string, _ctx?: EditProfileValidationContext): null =>
        null,
    },
  });

  // Fetch all states
  const isInterpreter = profile?.type === UserType.INTERPRETER;

  const [selectedState, setselectedState] = useState(fields.state.value);

  const { data: states } = useApiGet<StateAndCityResponse>(
    ApiRoutes.states.base,
    undefined,
    { enabled: isInterpreter },
  );

  let stateOptions: OptionItem[] = [];
  if (states?.success && states?.data) {
    stateOptions = states.data.map((state) => ({
      label: state.name,
      value: state.name,
    }));
  }

  // Fetch cities based on selected state
  const { data: cities } = useApiGet<StateAndCityResponse>(
    ApiRoutes.states.cities(selectedState),
    undefined,
    { enabled: isInterpreter && !!selectedState },
  );

  let cityOptions: OptionItem[] = [];
  if (cities?.success && cities?.data) {
    cityOptions = cities.data.map((city) => ({
      label: city.name,
      value: city.name,
    }));
  }

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue('birthday', formatDate(selectedDate));
    }
  };

  const handlePickProfileAvatar = async () => {
    const image = await pickImage();
    if (image) {
      setSelectedImage(image);
      setIsImageDeleted(false);
    }
  };

  const toMinutes = (time?: string): number => {
    if (!time) return -1;
    const [h, m] = time.split(':').map(Number);
    return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : -1;
  };

  function handleBack() {
    clearErrors();
    router.back();
  }

  async function handleUpdate() {
    if (!profile) return;
    if (
      !validateForm({
        type: profile.type as UserType,
        state: selectedState,
        modality: fields.modality.value,
      })
    )
      return;

    // Detect if email was changed
    const emailChanged =
      fields.email.value.trim().toLowerCase() !==
      (profile.email || '').trim().toLowerCase();

    const nameChanged =
      fields.name.value.trim().toLowerCase() !==
        (profile.type !== UserType.ENTERPRISE
          ? profile.name
          : profile.corporate_reason) || ''.trim().toLowerCase();

    // Build payloads based on user type
    const payload = buildEditPayload(profile.type as UserType, fields);
    if (!payload) return;

    let api;
    switch (profile.type) {
      case UserType.PERSON:
        api = personApi;
        break;
      case UserType.ENTERPRISE:
        api = enterpriseApi;
        break;
      case UserType.INTERPRETER:
        api = interpreterApi;
        break;
      default:
        return;
    }

    const specialtiesPayload = {
      specialty_ids: fields.selectedSpecialties.value,
      replace_existing: true, // Always replace existing specialties - similar to PUT behavior
    };

    if (!api && !userSpecialtyApi && !userPictureApi) return;

    const profilePromise = api.patch(payload);
    const specialtyPromise = userSpecialtyApi.post(specialtiesPayload);

    let pictureOkPromise: Promise<boolean>;
    if (selectedImage) {
      pictureOkPromise = userPictureApi
        .post(buildAvatarFormData(selectedImage))
        .then((r) => !!r?.picture)
        .catch(() => false);
    } else if (profile?.picture && !selectedImage) {
      pictureOkPromise = userPictureDeleteApi
        .del()
        .then(() => true)
        .catch(() => false);
    } else {
      pictureOkPromise = Promise.resolve(true);
    }

    // Submit updates
    const [profileResponse, specialtyResponse, pictureOk] = await Promise.all([
      profilePromise,
      specialtyPromise,
      pictureOkPromise,
    ]);

    if (
      !profileResponse?.success ||
      !specialtyResponse?.success ||
      !pictureOk
    ) {
      router.replace('/(tabs)/profile');
      await new Promise((resolve) => setTimeout(resolve, 300));
      Toast.show({
        type: 'error',
        text1: Strings.edit.toast.errorTitle,
        text2: Strings.edit.toast.errorDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
      return;
    }

    // Patch/Post schedules for changed days only
    if (SCHEDULE_ENABLED && isInterpreter) {
      const keys = Object.keys(Days) as Days[];

      const updates: { id: string; payload: ScheduleRequest }[] = [];
      const creates: ScheduleRequest[] = [];

      for (const key of keys) {
        const curr = schedule[key];
        const init = initialScheduleRef.current[key];
        const changed =
          (curr?.from ?? '') !== (init?.from ?? '') ||
          (curr?.to ?? '') !== (init?.to ?? '');

        if (!changed || !curr?.from || !curr?.to) continue;

        const id = scheduleIds[key];

        const payload: ScheduleRequest = {
          day: key as Days,
          interpreter_id: profile.id!,
          start_time: `${curr.from}:00`,
          end_time: `${curr.to}:00`,
        };

        if (id) {
          updates.push({ id, payload });
        } else {
          creates.push(payload);
        }
      }

      // PATCH
      let patchResults: (ScheduleResponse | null)[] = [];
      if (updates.length > 0) {
        patchResults = await Promise.all(
          updates.map(({ id, payload }) =>
            scheduleApiPatch.patchAt(
              ApiRoutes.schedules.updatePerDay(id),
              payload,
            ),
          ),
        );
      }

      // POST
      let createResults: (ScheduleResponse | null)[] = [];
      if (creates.length > 0) {
        createResults = await Promise.all(
          creates.map((payload) => scheduleApiPost.post(payload)),
        );
      }

      const failedPatch = patchResults.some((r) => !r?.success);
      const failedCreate = createResults.some((r) => !r?.success);

      if (failedPatch || failedCreate) {
        router.replace('/(tabs)/profile');
        await new Promise((resolve) => setTimeout(resolve, 300));
        Toast.show({
          type: 'error',
          text1: Strings.edit.toast.scheduleErrorTitle,
          text2: Strings.edit.toast.scheduleErrorDescription,
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
          closeIconSize: 1,
        });
        return;
      }
    }

    if (nameChanged || emailChanged) {
      // Keep AuthContext user in sync
      await updateUser({
        name:
          profile.type === UserType.ENTERPRISE
            ? fields.reason.value
            : fields.name.value,
        email: fields.email.value,
      });
    }

    // If email changed, force re-login to renew tokens
    if (emailChanged) {
      logout();
      await new Promise((resolve) => setTimeout(resolve, 300));
      Toast.show({
        type: 'info',
        text1: Strings.edit.toast.emailChangedTitle,
        text2: Strings.edit.toast.emailChangedDescription,
        position: 'top',
        visibilityTime: 2500,
        autoHide: true,
        closeIconSize: 1,
      });
      return;
    }

    await markProfileAsCompleted();

    // Successful update logic (e.g., navigate to profile)
    router.replace('/(tabs)/profile');
    await new Promise((resolve) => setTimeout(resolve, 300));
    Toast.show({
      type: 'success',
      text1: Strings.edit.toast.successTitle,
      text2: Strings.edit.toast.successDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      closeIconSize: 1,
    });
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.edit.header}
          showBackButton={true}
          handleBack={handleBack}
        />
      </View>
      <KeyboardAvoidingView
        className="flex-1 w-full px-10"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-8">
            <TouchableOpacity
              onPress={
                IMAGE_UPLOAD_ENABLED ? handlePickProfileAvatar : undefined
              }
              disabled={!IMAGE_UPLOAD_ENABLED}
              className="justify-center items-center mb-4"
            >
              <View className="relative">
                <Avatar size="lg" borderRadius="full" className="h-32 w-32">
                  <AvatarImage
                    source={{
                      uri: isImageDeleted
                        ? getSafeAvatarUri({
                            remoteUrl: '',
                          })
                        : selectedImage?.uri ||
                          getSafeAvatarUri({
                            remoteUrl: profile?.picture,
                          }),
                    }}
                  />
                </Avatar>
                {IMAGE_UPLOAD_ENABLED && (
                  <View>
                    <View className="absolute bottom-0 right-2 bg-white dark:bg-background-dark rounded-full p-2 shadow-xl">
                      <Pencil size={20} color={colors.primaryBlue} />
                    </View>
                    <View className="absolute bottom-24 left bg-white dark:bg-background-dark rounded-full p-2 shadow-xl">
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedImage(null);
                          setIsImageDeleted(true);
                        }}
                      >
                        <Trash size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
              <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.edit.basicData}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="w-full h-px bg-gray-200 mb-6" />

            <View className="w-full flex-row self-start items-center gap-2 mb-4">
              <FileText />
              <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.edit.basicData}
              </Text>
            </View>

            <View className="flex-1 justify-between">
              {/* Enterprise fields */}
              {profile?.type === UserType.ENTERPRISE && (
                <View className="gap-3">
                  <FormControl isRequired isInvalid={!!fields.reason.error}>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.reason}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder="Empresa X"
                        className="font-ifood-regular"
                        value={fields.reason.value}
                        onChangeText={(v) => setValue('reason', v)}
                        maxLength={100}
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.reason.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!fields.cnpj.error}>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.cnpj}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder="00.000.000/0001-00"
                        className="font-ifood-regular"
                        value={fields.cnpj.value}
                        onChangeText={(v) =>
                          setValue('cnpj', handleCnpjChange(v))
                        }
                        maxLength={18}
                        keyboardType="numeric"
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.cnpj.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                </View>
              )}

              {/* Person and Interpreter fields */}
              {(profile?.type === UserType.PERSON || isInterpreter) && (
                <View className="gap-3">
                  <FormControl isRequired isInvalid={!!fields.name.error}>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.name}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder="Nome X"
                        className="font-ifood-regular"
                        value={fields.name.value}
                        onChangeText={(v) => setValue('name', v)}
                        maxLength={100}
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.name.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!fields.birthday.error}>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.birthday}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <Input pointerEvents="none">
                        <InputField
                          placeholder="DD/MM/AAAA"
                          className="font-ifood-regular"
                          value={fields.birthday.value}
                          editable={false}
                        />
                      </Input>
                    </TouchableOpacity>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.birthday.error}
                      </FormControlErrorText>
                    </FormControlError>
                    {showDatePicker && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        maximumDate={maxDate}
                        display="calendar"
                        onChange={handleDateChange}
                      />
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!fields.gender.error}>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.gender}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <ModalSingleSelection
                      items={genders}
                      selectedValue={fields.gender.value}
                      onSelectionChange={(value) => setValue('gender', value)}
                      hasError={!!fields.gender.error}
                    />
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.gender.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                </View>
              )}

              {/* Common fields */}
              <View className="gap-3 mt-4">
                <FormControl isRequired isInvalid={!!fields.phone.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.phone}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="(00) 00000-0000"
                      className="font-ifood-regular"
                      value={fields.phone.value}
                      onChangeText={(v) =>
                        setValue('phone', handlePhoneChange(v))
                      }
                      keyboardType="phone-pad"
                      maxLength={15}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.phone.error}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <FormControl isRequired isInvalid={!!fields.email.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.email}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="example@gmail.com"
                      className="font-ifood-regular"
                      value={fields.email.value}
                      autoCapitalize="none"
                      onChangeText={(v) => setValue('email', v)}
                      keyboardType="email-address"
                      maxLength={250}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.email.error}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </View>

              {/* Preferences or Professional Area */}
              <View className="flex-row self-start mt-10 gap-2">
                {isInterpreter ? (
                  <>
                    <BriefcaseBusiness />
                    <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.professionalArea}
                    </Text>
                  </>
                ) : (
                  <>
                    <Bookmark />
                    <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.preferences}
                    </Text>
                  </>
                )}
              </View>

              <FormControl
                isRequired
                isInvalid={!!fields.selectedSpecialties.error}
                className="mt-4"
              >
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.common.fields.specialties}
                  </FormControlLabelText>
                </FormControlLabel>
                <ModalMultipleSelection
                  items={specialties}
                  selectedValues={fields.selectedSpecialties.value}
                  onSelectionChange={(value) =>
                    setValue('selectedSpecialties', value)
                  }
                  hasError={!!fields.selectedSpecialties.error}
                />
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-600"
                  />
                  <FormControlErrorText>
                    {fields.selectedSpecialties.error}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              {isInterpreter && (
                <>
                  <FormControl isInvalid={!!fields.cnpj.error} className="mt-4">
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.cnpj} (
                        {Strings.common.fields.optional})
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder="00.000.000/0001-00"
                        className="font-ifood-regular"
                        value={fields.cnpj.value}
                        onChangeText={(v) =>
                          setValue('cnpj', handleCnpjChange(v))
                        }
                        maxLength={18}
                        keyboardType="numeric"
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.cnpj.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={!!fields.description.error}
                    className="mt-4 mb-6"
                  >
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.more}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <TextInput
                      className={`w-90 border rounded p-2 ${
                        fields.description.error
                          ? 'border-error-700'
                          : 'border-primary-0 focus:border-primary-950'
                      }`}
                      multiline
                      numberOfLines={7}
                      value={fields.description.value}
                      onChangeText={(text) => setValue('description', text)}
                      inputMode="text"
                    />
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.description.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!fields.modality.error}>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.modality}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <CheckboxGroup
                      value={fields.modality.value}
                      onChange={(keys: string[]) => {
                        setValue('modality', keys as Modality[]);
                      }}
                      className="flex-row justify-around w-80 py-2"
                    >
                      <Checkbox value={Modality.PERSONALLY}>
                        <CheckboxIndicator className="border w-6 h-6">
                          <CheckboxIcon className="w-6 h-6" as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>
                          {Strings.common.options.inPerson}
                        </CheckboxLabel>
                      </Checkbox>
                      <Checkbox value={Modality.ONLINE}>
                        <CheckboxIndicator className="border w-6 h-6">
                          <CheckboxIcon className="w-6 h-6" as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>
                          {Strings.common.options.online}
                        </CheckboxLabel>
                      </Checkbox>
                    </CheckboxGroup>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.modality.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  {/* Location */}
                  {fields.modality.value.includes(Modality.PERSONALLY) && (
                    <View className="mt-4">
                      <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.location}*
                      </Text>

                      <View className="flex-row justify-between mt-2 mb-4">
                        {/* State */}
                        <FormControl
                          isInvalid={!!fields.state.error}
                          className="w-24"
                        >
                          <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                              {Strings.common.fields.state}
                            </FormControlLabelText>
                          </FormControlLabel>
                          <ModalSingleSelection
                            items={stateOptions}
                            selectedValue={fields.state.value}
                            onSelectionChange={(value) => {
                              setValue('state', value);
                              setselectedState(value);
                              setValue('city', '');
                            }}
                            placeholderText={Strings.common.fields.state}
                            hasError={!!fields.state.error}
                          />
                          <FormControlError>
                            <FormControlErrorIcon
                              as={AlertCircleIcon}
                              className="text-red-600"
                            />
                            <FormControlErrorText>
                              {fields.state.error}
                            </FormControlErrorText>
                          </FormControlError>
                        </FormControl>

                        {/* City */}
                        <FormControl
                          isInvalid={!!fields.city.error}
                          className="w-52"
                        >
                          <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                              {Strings.common.fields.city}
                            </FormControlLabelText>
                          </FormControlLabel>
                          <ModalSingleSelection
                            items={cityOptions}
                            selectedValue={fields.city.value}
                            onSelectionChange={(value) => {
                              setValue('city', value);
                            }}
                            placeholderText={Strings.common.fields.city}
                            hasError={!!fields.city.error}
                          />
                          <FormControlError>
                            <FormControlErrorIcon
                              as={AlertCircleIcon}
                              className="text-red-600"
                            />
                            <FormControlErrorText>
                              {fields.city.error}
                            </FormControlErrorText>
                          </FormControlError>
                        </FormControl>
                      </View>

                      {/* Neighborhoods */}
                      <FormControl isInvalid={!!fields.neighborhoods.error}>
                        <FormControlLabel>
                          <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                            {Strings.common.fields.neighborhoods}
                          </FormControlLabelText>
                        </FormControlLabel>
                        <View className="flex-col gap-2">
                          {fields.neighborhoods.value.map(
                            (neighborhood: string, idx: number) => (
                              <View
                                key={idx}
                                className="flex-row items-center gap-2"
                              >
                                <Input className="flex-1">
                                  <InputField
                                    placeholder={`Bairro ${idx + 1}`}
                                    className="font-ifood-regular"
                                    value={neighborhood}
                                    autoCapitalize="none"
                                    onChangeText={(v) => {
                                      const updated = [
                                        ...fields.neighborhoods.value,
                                      ];
                                      updated[idx] = v;
                                      setValue('neighborhoods', updated);
                                    }}
                                    keyboardType="default"
                                    maxLength={100}
                                  />
                                </Input>
                                {/* Only show "-" button if not the first input */}
                                {fields.neighborhoods.value.length > 1 &&
                                  idx !== 0 && (
                                    <Button
                                      size="sm"
                                      variant="linked"
                                      onPress={() => {
                                        const updated: string[] =
                                          fields.neighborhoods.value.filter(
                                            (_: string, i: number) => i !== idx,
                                          );
                                        setValue(
                                          'neighborhoods',
                                          updated.length ? updated : [''],
                                        );
                                      }}
                                      className="px-2 bg-transparent data-[active=true]:bg-primary-50/15"
                                    >
                                      <ButtonIcon
                                        as={MinusIcon}
                                        className="text-primary-800"
                                      />
                                    </Button>
                                  )}
                                {/* "+" button only on the last input and if not reached max */}
                                {idx ===
                                  fields.neighborhoods.value.length - 1 &&
                                  fields.neighborhoods.value.length <
                                    MAX_NEIGHBORHOODS && (
                                    <Button
                                      size="sm"
                                      variant="linked"
                                      onPress={() =>
                                        setValue('neighborhoods', [
                                          ...fields.neighborhoods.value,
                                          '',
                                        ])
                                      }
                                      className="px-2 bg-transparent data-[active=true]:bg-primary-blue-press-light/15"
                                    >
                                      <ButtonIcon
                                        as={PlusIcon}
                                        className="text-primary-blue-light"
                                      />
                                    </Button>
                                  )}
                              </View>
                            ),
                          )}
                        </View>
                        <FormControlError>
                          <FormControlErrorIcon
                            as={AlertCircleIcon}
                            className="text-red-600"
                          />
                          <FormControlErrorText>
                            {fields.neighborhoods.error}
                          </FormControlErrorText>
                        </FormControlError>
                      </FormControl>
                    </View>
                  )}

                  {/* Image Rights */}
                  <View className="w-80 my-6">
                    <Text className="font-ifood-medium text-text-light mb-2 dark:text-text-dark">
                      {Strings.common.fields.imageRights}*
                    </Text>
                    <RadioGroup
                      value={fields.imageRight.value}
                      onChange={(value) => setValue('imageRight', value)}
                      className="flex-row items-center justify-around"
                    >
                      <Radio value={Strings.common.options.authorize}>
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>
                          <Text
                            className="font-ifood-regular"
                            style={{
                              color:
                                fields.imageRight.value ===
                                Strings.common.options.authorize
                                  ? colors.text
                                  : colors.disabled,
                            }}
                          >
                            {Strings.common.options.authorize}
                          </Text>
                        </RadioLabel>
                      </Radio>
                      <Radio value={Strings.common.options.deny}>
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>
                          <Text
                            className="font-ifood-regular"
                            style={{
                              color:
                                fields.imageRight.value ===
                                Strings.common.options.deny
                                  ? colors.text
                                  : colors.disabled,
                            }}
                          >
                            {Strings.common.options.deny}
                          </Text>
                        </RadioLabel>
                      </Radio>
                    </RadioGroup>
                  </View>

                  {/* Schedule */}
                  {SCHEDULE_ENABLED && (
                    <View className="w-full mt-6">
                      <Text className="font-ifood-medium text-text-light dark:text-text-dark mb-2">
                        {Strings.hours.title}
                      </Text>
                      <View className="flex-col gap-2">
                        {Object.entries(Days).map(([key, label]) => (
                          <FormControl key={key} className="mb-2">
                            <View className="flex-row items-center gap-1">
                              <Text className="w-32 font-ifood-regular text-text-light dark:text-text-dark">
                                {mapWeekDay(label)}
                              </Text>
                              <ModalSingleSelection
                                items={hourOptions}
                                selectedValue={
                                  schedule[key as keyof typeof schedule].from
                                }
                                onSelectionChange={(value) =>
                                  setSchedule((prev) => ({
                                    ...prev,
                                    [key]: {
                                      ...prev[key as keyof typeof schedule],
                                      from: value,
                                    },
                                  }))
                                }
                                placeholderText={Strings.hours.from}
                                scrollableHeight={220}
                                minWidth={72}
                              />
                              <Text className="mx-1 text-text-light dark:text-text-dark">
                                -
                              </Text>
                              <ModalSingleSelection
                                items={((): typeof hourOptions => {
                                  const from =
                                    schedule[key as keyof typeof schedule].from;
                                  const fromMins = toMinutes(from);
                                  return fromMins >= 0
                                    ? hourOptions.filter(
                                        (opt) =>
                                          toMinutes(String(opt.value)) >
                                          fromMins,
                                      )
                                    : hourOptions;
                                })()}
                                selectedValue={
                                  schedule[key as keyof typeof schedule].to
                                }
                                onSelectionChange={(value) =>
                                  setSchedule((prev) => ({
                                    ...prev,
                                    [key]: {
                                      ...prev[key as keyof typeof schedule],
                                      to: value,
                                    },
                                  }))
                                }
                                placeholderText={Strings.hours.to}
                                scrollableHeight={220}
                                minWidth={72}
                              />
                            </View>
                            <FormControlError>
                              <FormControlErrorIcon
                                as={AlertCircleIcon}
                                className="text-red-600"
                              />
                              <FormControlErrorText />
                            </FormControlError>
                          </FormControl>
                        ))}
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Bottom buttons */}
          <View className="mt-14 pb-6 gap-4">
            <Button
              size="md"
              onPress={handleUpdate}
              className="data-[active=true]:bg-primary-orange-press-light"
            >
              <ButtonIcon as={CheckIcon} className="text-white" />
              <Text className="font-ifood-regular text-text-dark">
                {Strings.common.buttons.save}
              </Text>
            </Button>

            <HapticTab
              onPress={handleBack}
              className="flex-row justify-center gap-2 py-2"
            >
              <XIcon color={colors.primaryOrange} />
              <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                {Strings.common.buttons.cancel}
              </Text>
            </HapticTab>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
