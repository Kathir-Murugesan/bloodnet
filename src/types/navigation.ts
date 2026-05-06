export type RootStackParamList = {
  Splash: undefined;
  DonorLogin: undefined;
  HospitalLogin: undefined;
  SignUpStep1: undefined;
  SignUpStep2: {
    fullName: string;
    age: string;
    bloodGroup: string;
    phone: string;
    email: string;
    password: string;
  };
  SignUpSuccess: undefined;
  AdminPanel: undefined;

  // Donor
  DonorApp: undefined;
  RequestDetail: { requestId: string };
  ConfirmModal: { requestId: string };
  Commitments: undefined;
  LiveMap: { commitmentId: string };
  DonorProfile: undefined;

  // Hospital
  HospitalApp: undefined;
  PostRequest: undefined;
  ManageRequests: undefined;
  RequestManage: { requestId: string };
  HospitalProfile: undefined;

  // Cross-cutting
  Notifications: undefined;
};
