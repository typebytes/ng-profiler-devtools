import { PoolData, UpdatePoolManager } from './update-pool-manager';
interface TracingMeasurement {
    left: number;
    top: number;
    width: number;
    height: number;
}
export declare class Tracer extends UpdatePoolManager<TracingMeasurement> {
    canvas: HTMLCanvasElement;
    present(uuid: string, tagName: any, measurement: any): void;
    drawImpl(pool: Map<string, PoolData<TracingMeasurement>>): void;
    private ensureCanvas;
}
export declare function createMeasurement(rect: ClientRect): {
    left: number;
    top: number;
    width: number;
    height: number;
};
export {};
