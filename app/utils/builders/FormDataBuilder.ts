export default class FormDataBuilder<T> {
    private readonly formData: FormData;

    constructor() {
        this.formData = new FormData();
    }

    append<K extends keyof T>(key: K, value: T[K]): void {
        if (typeof value === 'string') {
            this.formData.append(String(key), value);
        } else {
            throw new Error(`Unsupported value type for key ${String(key)}`);
        }
    }

    appendBoolean<K extends keyof T>(key: K, value: boolean): void {
        this.formData.append(String(key), value ? '1' : '0');
    }

    appendMethod(method: string): void {
        this.formData.append('_method', method);
    }

    appendJSON<K extends keyof T>(key: K, value: T[K]): void {
        this.formData.append(String(key), JSON.stringify(value));
    }

    appendFile<K extends keyof T>(key: K, file: File): void {
        this.formData.append(String(key), file);
    }

    appendFiles<K extends keyof T>(key: K, file: File | File[]): void {
        if (Array.isArray(file)) {
            for (const f of file) {
                if (!(f instanceof File)) {
                    throw new Error(`Value for key ${String(key)} contains non-File element`);
                }
                this.formData.append(String(key), f);
            }
        } else if (file instanceof File) {
            this.appendFile(key, file);
        } else {
            throw new Error(`Value for key ${String(key)} is not a File or array of Files`);
        }
    }

    freeAppend<K extends keyof T>(key: K, value: string): void {
        this.formData.append(String(key), value);
    }

    put(data: Partial<T>): void {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key] as T[keyof T]; // Type assertion for value
                if (value === null) {
                    this.freeAppend(key as keyof T, '');
                } else if (typeof value === 'string') {
                    this.append(key as keyof T, value);
                } else if (value instanceof File) {
                    this.appendFile(key as keyof T, value);
                } else if (typeof value === 'boolean') {
                    this.appendBoolean(key as keyof T, value);
                } else if (Array.isArray(value)) {
                    this.appendJSON(key as keyof T, value);
                } else {
                    this.freeAppend(key as keyof T, String(value));
                }
            }
        }
    }

    build(): FormData {
        return this.formData;
    }
}