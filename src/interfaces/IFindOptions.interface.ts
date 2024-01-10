export interface IQrFindOptions {
  author?: string;
  lock?: string;
  locks?: string[];
  valid_from?: number;
  valid_to?: number;
  only_active?: boolean;
  only_expired?: boolean;
  offset?: number;
}