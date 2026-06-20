export type MissionImage = {
    name?: string;
    image_url?: string;
};

export type Mission = {
    uuid: string;
    name: string;
    label: string;
    country: string;
    image?: string | MissionImage | null;
    image_url?: string | null;
    active: boolean;
    created_at?: string;
    updated_at?: string;
};

export type MissionPayload = {
    name: string;
    label: string;
    country: string;
    active?: boolean | number | string;
    image?: File | null;
};