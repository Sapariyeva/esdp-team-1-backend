export interface IQrFindOptions {
  author?: string;
  lock?: string;
  locks?: string[];
  date_from?: number;
  date_to?: number;
  only_active?: number;
  only_expired?: number;
  offset?: number;
}