// // src/modules/company/types/social-network.ts

// export type SocialNetworkProfileLabel =
//   | "Principal"
//   | "Secundario";

// export interface SocialNetwork {
//   uuid: string;
//   name: string;
//   icon?: string;
// }

// export interface SocialNetworkProfile {
//   uuid: string;
//   nickname: string;
//   label: SocialNetworkProfileLabel;
//   url?: string;

//   // El listado devuelve este campo.
//   social_network_name?: string;

//   // El detalle devuelve este objeto.
//   social_network?: SocialNetwork;
// }

// export interface SocialNetworkProfilePayload {
//   social_network_uuid: string;
//   nickname: string;
//   url: string;
//   label: SocialNetworkProfileLabel;
// }

// export interface SocialNetworkProfilePaginationLink {
//   url: string | null;
//   label: string;
//   page: number | null;
//   active: boolean;
// }

// export interface SocialNetworkProfilePagination {
//   current_page: number;
//   data: SocialNetworkProfile[];
//   first_page_url: string;
//   from: number | null;
//   last_page: number;
//   last_page_url: string;
//   links: SocialNetworkProfilePaginationLink[];
//   next_page_url: string | null;
//   path: string;
//   per_page: number;
//   prev_page_url: string | null;
//   to: number | null;
//   total: number;
// }

// export interface SocialNetworkProfilesResponse {
//   success: boolean;
//   message: string;
//   data: SocialNetworkProfilePagination;
// }

// export interface SocialNetworkProfileResponse {
//   success: boolean;
//   message: string;
//   data: SocialNetworkProfile;
// }

// export interface SocialNetworksResponse {
//   success: boolean;
//   message: string;
//   data: SocialNetwork[];
// }

// export interface DeleteSocialNetworkProfileResponse {
//   success: boolean;
//   message: string;
//   data?: null;
// }