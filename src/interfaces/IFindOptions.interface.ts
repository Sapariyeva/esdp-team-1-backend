export interface IQrFindOptions {
  author?: string;
  phone?: string;
  lock?: string;
  locks?: string[];
  date_from?: number;
  date_to?: number;
  only_active?: string;
  only_expired?: string;
  offset?: number;
}