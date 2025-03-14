import { Types } from 'mongoose';

export type TCarouselItem = {
  _id: Types.ObjectId;
  img: string;
  title: string;
  description: string;
};

export type TCustomization = {
  logo?: string;
  banner_1?: string;
  banner_2?: string;
  banner_3?: string;
  banner_4?: string;
  carousel: TCarouselItem[];
  isDeleted: boolean;
};

export interface UpdateCarouselPayload {
  _id: string;
  imageIndexToUpdate?: number;
  title?: string;
  description?: string;
}

export const ImagePropertyType = {
  logo: 'logo',
  banner_1: 'banner_1',
  banner_2: 'banner_2',
  banner_3: 'banner_3',
  banner_4: 'banner_4',
} as const;
export type ImagePropertyType =
  (typeof ImagePropertyType)[keyof typeof ImagePropertyType];
