import prisma from '../../../user/config/database';
import { CreateNoticeDto, UpdateNoticeDto } from './notice.types';

export async function createNotice(data: CreateNoticeDto) {
  const createData: any = {
    title: data.title,
    tags: data.tags || [],
    description: data.description,
    url: data.url,
    province: data.province,
    district: data.district,
    municipality: data.municipality,
    ward: data.ward,
    contact: data.contact,
    ageGroup: data.ageGroup,
    gender: data.gender,
    ethnicity: data.ethnicity,
    profession: data.profession,
    qualification: data.qualification,
    status: data.status || 'draft',
    ocrText: data.ocrText,
    ocrConfidence: data.ocrConfidence,
    extractedFields: data.extractedFields,
    processingStatus: data.processingStatus || 'pending',
  };

  if (data.effectiveFrom) createData.effectiveFrom = new Date(data.effectiveFrom);
  if (data.deadline) createData.deadline = new Date(data.deadline);

  const notice = await prisma.notice.create({
    data: createData,
  });

  return notice;
}

export async function getAllNotices(filters?: {
  status?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  tags?: string[];
}) {
  const where: any = {};

  if (filters?.status) where.status = filters.status;
  if (filters?.province) where.province = filters.province;
  if (filters?.district) where.district = filters.district;
  if (filters?.municipality) where.municipality = filters.municipality;
  if (filters?.ward) where.ward = filters.ward;
  if (filters?.tags && filters.tags.length > 0) {
    where.tags = { hasSome: filters.tags };
  }

  const notices = await prisma.notice.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return notices;
}

export async function getNoticeById(id: string) {
  const notice = await prisma.notice.findUnique({
    where: { id },
  });

  if (!notice) throw new Error('Notice not found');
  return notice;
}

export async function updateNotice(id: string, data: UpdateNoticeDto) {
  const updateData: any = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.url !== undefined) updateData.url = data.url;
  if (data.province !== undefined) updateData.province = data.province;
  if (data.district !== undefined) updateData.district = data.district;
  if (data.municipality !== undefined) updateData.municipality = data.municipality;
  if (data.ward !== undefined) updateData.ward = data.ward;
  if (data.contact !== undefined) updateData.contact = data.contact;
  if (data.ageGroup !== undefined) updateData.ageGroup = data.ageGroup;
  if (data.gender !== undefined) updateData.gender = data.gender;
  if (data.ethnicity !== undefined) updateData.ethnicity = data.ethnicity;
  if (data.profession !== undefined) updateData.profession = data.profession;
  if (data.qualification !== undefined) updateData.qualification = data.qualification;
  if (data.status !== undefined) updateData.status = data.status;

  if (data.effectiveFrom !== undefined) {
    updateData.effectiveFrom = data.effectiveFrom ? new Date(data.effectiveFrom) : null;
  }
  if (data.deadline !== undefined) {
    updateData.deadline = data.deadline ? new Date(data.deadline) : null;
  }

  const notice = await prisma.notice.update({
    where: { id },
    data: updateData,
  });

  return notice;
}

export async function deleteNotice(id: string) {
  await prisma.notice.delete({ where: { id } });
  return true;
}
