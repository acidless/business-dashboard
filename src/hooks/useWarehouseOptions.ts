import {computed, type Ref} from "vue";
import type {Income} from "../types.ts";

export default function useWarehouseOptions<T>(data: Ref<T[]>) {
    return computed(() => {
        const unique = [...new Set(data.value.map((item: Income) => item.warehouse_name))];

        return unique
            .filter(name => name)
            .map((name, index) => ({
                label: name,
                value: name,
                key: `${name}-${index}`
            }));
    });
}