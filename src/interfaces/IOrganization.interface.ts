export interface IOrganization {
  id: string;
  name: string;
  legalAddress?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}