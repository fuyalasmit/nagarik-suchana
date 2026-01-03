export interface CreateNoticeDto {
  title: string;
  tags?: string[];
  description?: string;
  effectiveFrom?: string;
  deadline?: string;
  url?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  contact?: string;
  ageGroup?: string;
  gender?: string;
  ethnicity?: string;
  profession?: string;
  qualification?: string;
  status?: string;
  ocrText?: string;
  ocrConfidence?: number;
  extractedFields?: any;
  processingStatus?: string;
}

export interface UpdateNoticeDto {
  title?: string;
  tags?: string[];
  description?: string;
  effectiveFrom?: string;
  deadline?: string;
  url?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  contact?: string;
  ageGroup?: string;
  gender?: string;
  ethnicity?: string;
  profession?: string;
  qualification?: string;
  status?: string;
}
