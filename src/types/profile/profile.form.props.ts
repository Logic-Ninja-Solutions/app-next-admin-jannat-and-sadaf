export interface ProfileFormProps<T> {
  initialValues: T | undefined;
  onSubmitSuccess: (data: T) => Promise<void>;
}
