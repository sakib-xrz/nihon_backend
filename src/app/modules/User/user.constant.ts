export const USER_STATUS = {
  active: 'active' as const,
  blocked: 'blocked' as const,
};
export const GENDER = {
  male: 'male' as const,
  female: 'female' as const,
  other: 'other' as const,
};

export const USER_ROLE = {
  superAdmin: 'superAdmin' as const,
  admin: 'admin' as const,
  moderator: 'moderator' as const,
  user: 'user' as const,
};

// exporting types
export type TUserStatus = keyof typeof USER_STATUS; // 'active' | 'blocked'
export type TUserGender = keyof typeof GENDER; // 'male' | 'female' | 'other'
export type TUserRole = keyof typeof USER_ROLE; // 'superAdmin' | 'admin' | 'moderator' | 'user'
