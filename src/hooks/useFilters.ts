import {computed, type Ref, watch, ref} from "vue";

type FiltersType<T> = {
    [key: string]: { value: any, filter: (item: T, filterVal: any) => boolean, excludeApplied?: boolean}
};

type UseFiltersOptions<T> = {
    initialFilters: FiltersType<T>;
    data: Ref<T>;
}

export function useFilters<T>(options: UseFiltersOptions<T>) {
    const {initialFilters, data} = options;

    const filters = ref(initialFilters);

    const filtersApplied = computed(() => {
        return Object.values(filters.value).some((filter) => {
            if(filter.excludeApplied) {
                return false;
            }

            if (Array.isArray(filter.value)) {
                return filter.value.length > 0 && filter.value[0] !== new Date(0).getTime();
            }

            return filter.value !== null && filter.value !== '';
        });
    });

    const processedData = ref<T[]>([]);

    function filterData() {
        processedData.value = data.value.filter((item) => {
            return Object.entries(filters.value).every(([key, filter]: [string, any]) => {
                return filter.filter(item, filter.value);
            });
        });
    }

    function onFiltersChange(newFilters: typeof filters.value) {
        filters.value = newFilters;
        filterData();
    }

    function clearFilter() {
        Object.keys(filters.value).forEach((key) => {
            const initialValue = initialFilters[key as keyof typeof initialFilters].value;
            filters.value[key as keyof typeof filters.value].value = initialValue;
        });
        filterData();
    }

    watch([data], () => {
        filterData();
    });

    return {filtersApplied, clearFilter, filterData, filters, onFiltersChange, processedData};
}