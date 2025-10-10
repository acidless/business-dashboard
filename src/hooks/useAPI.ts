import {type ComputedRef, type Ref, ref, watch} from "vue";

type ResponseType<T> = {
    data: T[];
    meta?: {
        total: number;
    }
}

type QueryType = Ref<Record<string, string>> | ComputedRef<Record<string, string>>;

function makeQueryString(query: QueryType) {
    const base = `?key=${import.meta.env.VITE_API_KEY}`;
    return base + Object.keys(query.value).reduce((str, key) => {
        return str + `&${key}=${query.value[key]}`;
    }, "");
}

function useAPI<T extends {}>(endpoint: string, query: QueryType) {
    const data = ref<ResponseType<T>>({data: []});
    const error = ref<Record<string, string> | null>(null);
    const loading = ref(false);

    watch(query, async () => {
        loading.value = true;

        const queryString = makeQueryString(query);

        try {
            const response = await fetch(`/api/${endpoint}${queryString}`);
            if (response.ok) {
                data.value = await response.json();
            } else {
                error.value = await response.json();
            }
        } catch (e: any) {
            console.error(e);
            error.value = e;
        }


        loading.value = false;
    }, {immediate: true});

    return {data, error, loading};
}

export default useAPI;