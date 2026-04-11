export class TestDTO {
  id?: number;
  testCode: string;
  testName: string;
  shortName: string;
  category?: string;
  sampleType?: string;
  price?: number;
  status?: string;
  resultType?: string;
  unit?: string;
  referenceRange?: string;
  method?: string;
  turnaroundTime?: string;
  fastingRequired?: boolean;
  preparationNotes?: string;
  description?: string;
  parameters?: any[];
  labId?: number;
  branchId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.testCode = data.testCode;
    this.testName = data.testName;
    this.shortName = data.shortName;
    this.category = data.category;
    this.sampleType = data.sampleType;
    this.price = data.price;
    this.status = data.status || "Active";
    this.resultType = data.resultType;
    this.unit = data.unit;
    this.referenceRange = data.referenceRange;
    this.method = data.method;
    this.turnaroundTime = data.turnaroundTime;
    this.fastingRequired =
      typeof data.fastingRequired === "boolean"
        ? data.fastingRequired
        : data.fastingRequired === "true";
    this.preparationNotes = data.preparationNotes;
    this.description = data.description;

    this.parameters =
      typeof data.parameters === "string"
        ? JSON.parse(data.parameters)
        : data.parameters || [];

    this.labId = data.labId;
    this.branchId = data.branchId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class CreateTestDTO {
  testCode: string;
  testName: string;
  shortName: string;
  category?: string;
  sampleType?: string;
  price?: number;
  status?: string;
  resultType?: string;
  unit?: string;
  referenceRange?: string;
  method?: string;
  turnaroundTime?: string;
  fastingRequired?: boolean;
  preparationNotes?: string;
  description?: string;
  parameters?: any[];
  branchId?: number;

  constructor(data: any) {
    this.testCode = data.testCode;
    this.testName = data.testName;
    this.shortName = data.shortName;
    this.category = data.category;
    this.sampleType = data.sampleType;
    this.price = data.price ? Number(data.price) : undefined;
    this.status = data.status || "Active";
    this.resultType = data.resultType;
    this.unit = data.unit;
    this.referenceRange = data.referenceRange;
    this.method = data.method;
    this.turnaroundTime = data.turnaroundTime;
    this.fastingRequired =
      typeof data.fastingRequired === "boolean"
        ? data.fastingRequired
        : data.fastingRequired === "true";
    this.preparationNotes = data.preparationNotes;
    this.description = data.description;
    this.parameters = data.parameters || [];
    this.branchId = data.branchId ? Number(data.branchId) : undefined;
  }
}

export class UpdateTestDTO {
  testCode?: string;
  testName?: string;
  shortName?: string;
  category?: string;
  sampleType?: string;
  price?: number;
  status?: string;
  resultType?: string;
  unit?: string;
  referenceRange?: string;
  method?: string;
  turnaroundTime?: string;
  fastingRequired?: boolean;
  preparationNotes?: string;
  description?: string;
  parameters?: any[];
  branchId?: number;

  constructor(data: any) {
    this.testCode = data.testCode;
    this.testName = data.testName;
    this.shortName = data.shortName;
    this.category = data.category;
    this.sampleType = data.sampleType;
    this.price = data.price ? Number(data.price) : undefined;
    this.status = data.status;
    this.resultType = data.resultType;
    this.unit = data.unit;
    this.referenceRange = data.referenceRange;
    this.method = data.method;
    this.turnaroundTime = data.turnaroundTime;
    this.fastingRequired =
      data.fastingRequired !== undefined
        ? typeof data.fastingRequired === "boolean"
          ? data.fastingRequired
          : data.fastingRequired === "true"
        : undefined;
    this.preparationNotes = data.preparationNotes;
    this.description = data.description;
    this.parameters = data.parameters;
    this.branchId = data.branchId ? Number(data.branchId) : undefined;
  }
}
