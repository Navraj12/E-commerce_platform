export interface Props {
  type: string;
  onSubmit: (data: UserDataType) => void;
  submitting?: boolean;
}

export interface UserDataType {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface UserLoginType {
  email: string;
  password: string;
}
