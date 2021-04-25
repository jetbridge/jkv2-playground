export { app } from "./app";
import { AlbumApi, topSongsHandler } from "@jetkit/cdk/src/test/sampleApp";

// a list of resources we would like infrastructure generated for
export const stackResources = [AlbumApi, topSongsHandler];
