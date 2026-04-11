import { Test } from "@prisma/client";
import { TestDTO, CreateTestDTO, UpdateTestDTO } from "../dtos/test.dto";

/**
 * Maps a Database Record (Prisma) to a Data Transfer Object (Frontend/API)
 */
export function MapTestToDTO(test: Test): TestDTO {
  return new TestDTO({
    id: test.id,
    testCode: test.testCode,
    testName: test.testName,
    shortName: test.shortName,
    category: test.category,
    sampleType: test.sampleType,
    price: test.price,
    status: test.status,
    resultType: test.resultType,
    unit: test.unit,
    referenceRange: test.referenceRange,
    method: test.method,
    turnaroundTime: test.turnaroundTime,
    fastingRequired: test.fastingRequired,
    preparationNotes: test.preparationNotes,
    description: test.description,
    // Ensure parameters are parsed if stored as a string in DB
    parameters: test.parameters
      ? typeof test.parameters === "string"
        ? JSON.parse(test.parameters)
        : test.parameters
      : [],
    labId: test.labId,
    branchId: test.branchId,
    createdAt: test.createdAt,
    updatedAt: test.updatedAt,
  });
}

/**
 * Maps a Creation DTO to a Prisma Create Input object
 */
export function MapCreateTest(dto: CreateTestDTO) {
  return {
    testCode: dto.testCode,
    testName: dto.testName,
    shortName: dto.shortName,
    category: dto.category,
    sampleType: dto.sampleType,
    price: dto.price,
    status: dto.status || "Active",
    resultType: dto.resultType,
    unit: dto.unit,
    referenceRange: dto.referenceRange,
    method: dto.method,
    turnaroundTime: dto.turnaroundTime,
    fastingRequired: dto.fastingRequired,
    preparationNotes: dto.preparationNotes,
    description: dto.description,
    parameters: dto.parameters
      ? JSON.stringify(dto.parameters)
      : JSON.stringify([]),
    branchId: dto.branchId,
  };
}

/**
 * Maps an Update DTO to a Prisma Update Input object,
 * only including fields that were actually provided.
 */
export function MapUpdateTest(dto: UpdateTestDTO) {
  const data: any = {};

  if (dto.testCode !== undefined) data.testCode = dto.testCode;
  if (dto.testName !== undefined) data.testName = dto.testName;
  if (dto.shortName !== undefined) data.shortName = dto.shortName;
  if (dto.category !== undefined) data.category = dto.category;
  if (dto.sampleType !== undefined) data.sampleType = dto.sampleType;
  if (dto.price !== undefined) data.price = dto.price;
  if (dto.status !== undefined) data.status = dto.status;
  if (dto.resultType !== undefined) data.resultType = dto.resultType;
  if (dto.unit !== undefined) data.unit = dto.unit;
  if (dto.referenceRange !== undefined)
    data.referenceRange = dto.referenceRange;
  if (dto.method !== undefined) data.method = dto.method;
  if (dto.turnaroundTime !== undefined)
    data.turnaroundTime = dto.turnaroundTime;
  if (dto.fastingRequired !== undefined)
    data.fastingRequired = dto.fastingRequired;
  if (dto.preparationNotes !== undefined)
    data.preparationNotes = dto.preparationNotes;
  if (dto.description !== undefined) data.description = dto.description;

  if (dto.parameters !== undefined) {
    data.parameters = dto.parameters
      ? JSON.stringify(dto.parameters)
      : JSON.stringify([]);
  }

  if (dto.branchId !== undefined) data.branchId = dto.branchId;

  return data;
}
