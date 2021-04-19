// Test that the correct AWS resources are generated from metadata

import { HttpApi } from "@aws-cdk/aws-apigatewayv2";
import { Stack } from "@aws-cdk/core";
import { ResourceGeneratorConstruct } from "..";
import { AlbumCrudApi } from "./sampleApp";
import "@aws-cdk/assert/jest";

describe("@CrudApi construct generation", () => {
  const stack = new Stack();
  const httpApi = new HttpApi(stack, "API");

  // should create routes on httpApi
  // and lambda handler function
  new ResourceGeneratorConstruct(stack, "Gen", {
    resources: [AlbumCrudApi],
    httpApi,
  });

  it("generates APIGW routes", () => {
    // should have routes
    expect(stack).toHaveResource("AWS::ApiGatewayV2::Route", {
      RouteKey: "ANY /album",
    });
  });

  it("creates lambda handler", () => {
    expect(stack).toHaveResource("AWS::Lambda::Function", {
      Handler: "index.handler",
      MemorySize: 512,
      Runtime: "nodejs14.x",
      Environment: {
        Variables: {
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
          IS_CLASS: "true",
        },
      },
    });
  });
});

describe("@SubRoute construct generation", () => {
  const stack = new Stack();
  const httpApi = new HttpApi(stack, "API");

  // should create routes on httpApi
  // and lambda handler function
  new ResourceGeneratorConstruct(stack, "Gen", {
    resources: [AlbumCrudApi],
    httpApi,
  });

  it("generates APIGW routes", () => {
    expect(stack).toHaveResource("AWS::ApiGatewayV2::Route", {
      RouteKey: "PATCH /test",
    });
  });

  it("creates lambda handler", () => {
    expect(stack).toHaveResource("AWS::Lambda::Function", {
      Handler: "index.handler",
      MemorySize: 512,
      Runtime: "nodejs14.x",
      Environment: {
        Variables: {
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
          IS_SUB_ROUTE: "true",
        },
      },
    });
  });
});