export interface PoolData<T> {
    hit: number;
    tagName: string;
    expiration: number;
    data: T;
}
export declare abstract class UpdatePoolManager<T> {
    pool: Map<string, PoolData<T>>;
    drawing: boolean;
    clearTimer: any;
    addAll(items: Map<string, any> | any): void;
    add(uuid: string, tagName: string, dataToAdd: T): void;
    firstExpirationDate(): number;
    draw(): void;
    private redraw;
    private scheduleDraw;
    abstract drawImpl(pool: Map<string, PoolData<T>>): any;
}
