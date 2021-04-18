import {
  enumerateMetadata,
  enumerateMethodMetadata,
  getJKMemberMetadata,
  getJKMetadata,
  getJKMetadataKeys,
  hasJKMetadata,
} from "../metadata";
import {
  Album,
  AlbumCrudApi,
  blargleFunc,
  wrappedBlargleFunc,
} from "./sample-app";

describe("Metadata decorators", () => {
  describe("@CrudApi decorator", () => {
    it("has metadata", () => {
      expect(hasJKMetadata(AlbumCrudApi)).toBeTruthy();
    });

    it("stores metadata", () => {
      expect(getJKMetadata(AlbumCrudApi)).toMatchObject({
        model: Album,
        apiClass: AlbumCrudApi,
        route: "/album",
        memorySize: 512,
      });
    });
  });

  describe("@SubRoute decorator", () => {
    it("stores metadata on methods", () => {
      // get keys
      expect(getJKMetadataKeys(AlbumCrudApi)).toEqual(["test"]);

      // get meta
      const methodMeta = getJKMemberMetadata(AlbumCrudApi, "test");
      expect(methodMeta).toMatchObject({
        propertyKey: "test",
        route: "/test",
      });
    });

    it("enumerates class metadata", () => {
      const [{ meta, resource }] = enumerateMetadata([AlbumCrudApi]);
      expect(meta).toMatchObject({
        apiClass: AlbumCrudApi,
        entry: /sample-app.ts$/,
        memorySize: 512,
        model: Album,
        route: "/album",
      });
      expect(resource).toBe(AlbumCrudApi);
    });

    it("enumerates method metadata", () => {
      const methodMeta = enumerateMethodMetadata(AlbumCrudApi);
      expect(methodMeta).toStrictEqual([
        {
          propertyKey: "test",
          requestHandlerFunc: AlbumCrudApi.prototype.test,
          route: "/test",
        },
      ]);
    });
  });

  describe("Route()", () => {
    it("stores metadata on functions", () => {
      const funcMeta = getJKMetadata(wrappedBlargleFunc);
      expect(funcMeta).toStrictEqual({
        requestHandlerFunc: blargleFunc,
        route: "/blargle",
      });
    });
  });
});
