/* eslint-disable import/prefer-default-export */
import { SupportedEngine } from "measy";

export interface CreateReadMeOptions {
  dir?: string;
  contextFiles?: string | string[];
  rootContextFiles?: string | string[];
  partialDirs?: string | string[];
  engine?: SupportedEngine;
  functionFiles?: string | string[];
  rootFunctionFiles?: string | string[];
  templateExtension?: string;
}
