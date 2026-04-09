import { Test } from "@prisma/client";

export class TestMapper {
  static toDomain(raw: Test): any {
    if (!raw) return null;
    return {
      id: raw.id,
      testCode: raw.testCode,
      testName: raw.testName,
      shortName: raw.shortName,
      category: raw.category,
      sampleType: raw.sampleType,
      price: raw.price,
      status: raw.status,

      resultType: raw.resultType,
      unit: raw.unit,
      referenceRange: raw.referenceRange,
      method: raw.method,
      turnaroundTime: raw.turnaroundTime,

      fastingRequired: raw.fastingRequired,
      preparationNotes: raw.preparationNotes,
      description: raw.description,
      
      parameters: raw.parameters ? JSON.parse(raw.parameters) : [],

      labId: raw.labId,
      branchId: raw.branchId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
