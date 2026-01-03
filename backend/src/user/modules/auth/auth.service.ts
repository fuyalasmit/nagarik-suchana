import bcrypt from "bcryptjs";
import prisma from "../../config/database";
import { RegisterDto } from "./auth.types";

const Salt = 10;

export async function registerUser(data: RegisterDto) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("User already Exists");
  const hashed = await bcrypt.hash(data.password, Salt);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      phone: data.phone,
      address: data.address,
      gender: data.gender,
      ethnicity: data.ethnicity,
      profession: data.profession,
      qualification: data.qualification,
      province: data.province,
      district: data.district,
      municipality: data.municipality,
      ward: data.ward,
      dob: data.dob,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      dob: true,
      gender: true,
      ethnicity: true,
      profession: true,
      qualification: true,
      province: true,
      district: true,
      municipality: true,
      ward: true,
      createdAt: true,
    },
  });
  return user;
}
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      dob: true,
      gender: true,
      ethnicity: true,
      profession: true,
      qualification: true,
      province: true,
      district: true,
      municipality: true,
      ward: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
export async function updateUser(
  id: string,
  data: {
    name?: string;
    phone?: string | null;
    address?: string | null;
    password?: string;
    dob?: string | null;
    gender?: string | null;
    ethnicity?: string | null;
    profession?: string | null;
    qualification?: string | null;
    province?: string | null;
    district?: string | null;
    municipality?: string | null;
    ward?: string | null;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.dob !== undefined)
    updateData.dob = data.dob ? new Date(data.dob) : null;
  if (data.gender !== undefined) updateData.gender = data.gender;
  if (data.ethnicity !== undefined) updateData.ethnicity = data.ethnicity;
  if (data.profession !== undefined) updateData.profession = data.profession;
  if (data.qualification !== undefined)
    updateData.qualification = data.qualification;
  if (data.province !== undefined) updateData.province = data.province;
  if (data.district !== undefined) updateData.district = data.district;
  if (data.municipality !== undefined)
    updateData.municipality = data.municipality;
  if (data.ward !== undefined) updateData.ward = data.ward;

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, Salt);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      dob: true,
      gender: true,
      ethnicity: true,
      profession: true,
      qualification: true,
      province: true,
      district: true,
      municipality: true,
      ward: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  return true;
}
