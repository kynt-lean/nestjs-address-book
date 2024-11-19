'use strict';

import 'dotenv/config';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

// Configure the SDK to export telemetry data to the OTLP endpoint
const exporterOptions = {
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
};

const sdk = new NodeSDK({
  spanProcessors: [
    new BatchSpanProcessor(new OTLPTraceExporter(exporterOptions)),
  ],
  logRecordProcessors: [
    new BatchLogRecordProcessor(new OTLPLogExporter(exporterOptions)),
  ],
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'address-book-service',
    [ATTR_SERVICE_VERSION]: '1.0.0',
  }),
});

export default sdk;

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
