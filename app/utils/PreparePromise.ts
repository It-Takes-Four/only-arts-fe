import { toast } from 'sonner';
import { AxiosError, type AxiosResponse } from "axios";
import type { EndpointCallResponseMessage } from "../components/core/_models";

type SuccessCallback<T> = (data: T) => void;
type ErrorCallback = (error: AxiosError<EndpointCallResponseMessage>) => void;
type Config = {
    tryOnError?: number;
};

const preparePromise = async <T>(
    promise: Promise<AxiosResponse<T>>,
    successCallback: SuccessCallback<AxiosResponse<T>>,
    errorCallback: ErrorCallback,
    config?: Config
) => {
    const { tryOnError = 0 } = config || {}; // Ensure tryOnError has a default value of 0
    const tryCount = tryOnError;
    const loadingMessage = tryCount ? `Fetch ${tryCount + 1 - tryOnError} of ${tryCount + 1}, loading...` : 'Loading...';
    const loading = toast.loading(loadingMessage);

    try {
        const result = await promise;
        toast.dismiss(loading);
        successCallback(result);
    } catch (error: unknown) {
        toast.dismiss(loading);
        const axiosError = error as AxiosError<EndpointCallResponseMessage>;
        errorCallback(axiosError);

        if (tryCount > 0) {
            setTimeout(() => {
                preparePromise(promise, successCallback, errorCallback, { tryOnError: tryCount - 1 });
            }, 1000); // Adjust the timeout as needed
        }
    }
};

export default preparePromise;