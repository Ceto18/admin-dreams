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

    featured_on_home?: boolean | number | string;
    home_order?: number | null;

    created_at?: string;
    updated_at?: string;
};

export type MissionPayload = {
    name: string;
    label: string;
    country: string;

    featured_on_home: boolean | number;
    home_order: number | null;

    image?: File | null;
};