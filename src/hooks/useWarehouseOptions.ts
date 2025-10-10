import {computed, type Ref} from "vue";

export default function useWarehouseOptions<T extends { warehouse_name: string }>(data: Ref<T[]>) {
    return computed(() => {
        const unique = [...new Set(data.value.map((item: T) => item.warehouse_name))];

        return unique
            .filter(name => name)
            .map((name, index) => ({
                label: name,
                value: name,
                key: `${name}-${index}`
            }));
    });
}