import { CorsHttpMethod, HttpApi } from "@aws-cdk/aws-apigatewayv2";
import {
  CfnOutput,
  Construct,
  Duration,
  Stack,
  StackProps,
} from "@aws-cdk/core";
import { JetKitCdkApp, ResourceGeneratorConstruct } from "@jetkit/cdk";
import { stackResources } from "demo-backend";

export interface ICrudApisProps {
  httpApi: HttpApi;
  app: JetKitCdkApp;
}

export class CrudApis extends Construct {
  constructor(scope: Construct, id: string, props: ICrudApisProps) {
    super(scope, id);

    const { httpApi } = props;

    new ResourceGeneratorConstruct(this, "Generator", {
      resources: stackResources,
      httpApi,
    });

    new CfnOutput(this, `BaseUrl`, {
      value: httpApi.url || "Unknown",
    });
  }
}

export class InfraStack extends Stack {
  constructor(scope: JetKitCdkApp, id: string, props?: StackProps) {
    super(scope, id, props);

    const httpApi = new HttpApi(this, "Api", {
      corsPreflight: {
        allowHeaders: ["Authorization"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.HEAD,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.POST,
        ],
        allowOrigins: ["*"],
        maxAge: Duration.days(10),
      },
    });

    new CrudApis(this, "CrudApis", { app: scope, httpApi });
  }
}
