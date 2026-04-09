export type CreateStaffInput = {
  name: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  photo?: string;
  branchId?: number;
  status: string;
  isTempPassword?: boolean;
};
