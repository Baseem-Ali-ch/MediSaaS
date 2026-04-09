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

  constructor(data: any) {
    this.testCode = data.testCode;
    this.testName = data.testName;
    this.shortName = data.shortName;
    this.category = data.category;
    this.sampleType = data.sampleType;
    this.price = data.price;
    this.status = data.status || 'Active';

    this.resultType = data.resultType;
    this.unit = data.unit;
    this.referenceRange = data.referenceRange;
    this.method = data.method;
    this.turnaroundTime = data.turnaroundTime;

    this.fastingRequired = typeof data.fastingRequired === 'boolean' ? data.fastingRequired : data.fastingRequired === 'true';
    this.preparationNotes = data.preparationNotes;
    this.description = data.description;

    this.parameters = data.parameters;
  }
}

export class UpdateTestDTO extends CreateTestDTO {
  constructor(data: any) {
    super(data);
  }
}
