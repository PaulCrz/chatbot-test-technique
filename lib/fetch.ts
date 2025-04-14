export interface ResultBase {
    id: string;
    name: string;
}

/** Possible request option values */
export type OptionType = "item_stock" | "item_lost" | "item_report" | "item_desc" | "loc_desc";

export interface Option extends ResultBase {
    description: string;
    ask_for_item: boolean;
    ask_for_location: boolean;
}

export const getAvailableOptions = async (): Promise<Option[]> => {
    let data = [];
    try {
        const res = await fetch("/api/options");
        data = await res.json();
    }
    catch (error) {
        console.error("Error fetching options", error);
    }
    return data;
};

/** Possible item category values */
export type ItemCategory = "towel" | "sheet" | "pillow_case";

export interface Item extends ResultBase {
    category: ItemCategory;
}

export const getAvailableItems = async (builtinFilter?: string, searchFilter?: string): Promise<Item[]> => {
    let data: Item[] = [];
    try {
        const params = new URLSearchParams();
        if (builtinFilter)
            params.append("category", builtinFilter);
        if (searchFilter)
            params.append("search", searchFilter);
        const queryString = params.toString();
        const res = await fetch(`/api/items${queryString ? `?${queryString}` : ''}`);
        data = await res.json();
    }
    catch (error) {
        console.error("Error fetching items", error);
    }
    return data;
};

export const getItemFilters = async (): Promise<ItemCategory[]> => {
    let data = [];
    try {
        const res = await fetch("/api/items/filters");
        data = await res.json();
    }
    catch (error) {
        console.error("Error fetching item filters", error);
    }
    return data;
};

/** Possible location type values */
export type LocationType = "hotel" | "laundry";

export interface Location extends ResultBase {
    type: LocationType;
}

export const getAvailableLocations = async (builtinFilter?: string, searchFilter?: string): Promise<Location[]> => {
    let data = [];
    try {
        const params = new URLSearchParams();
        if (builtinFilter)
            params.append("type", builtinFilter);
        if (searchFilter)
            params.append("search", searchFilter);
        const queryString = params.toString();
        const res = await fetch(`/api/locations${queryString ? `?${queryString}` : ''}`);
        data = await res.json();
    }
    catch (error) {
        console.error("Error fetching locations", error);
    }
    return data;
};

export const getLocationFilters = async (): Promise<LocationType[]> => {
    let data = [];
    try {
        const res = await fetch("/api/locations/filters");
        data = await res.json();
    }
    catch (error) {
        console.error("Error fetching location filters", error);
    }
    return data;
};
