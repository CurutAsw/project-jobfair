'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { DashboardUser, ProfileUpdates } from '../_lib/user-profile';

type ProfileEditorModalProps = {
  user: DashboardUser;
  isOpen: boolean;
  mode: 'jobseeker' | 'company';
  onClose: () => void;
  onSave: (updates: ProfileUpdates) => void;
};

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((word) => word[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

export default function ProfileEditorModal({ user, isOpen, mode, onClose, onSave }: ProfileEditorModalProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [gender, setGender] = useState(user.gender);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [companyIndustry, setCompanyIndustry] = useState(user.companyIndustry);
  const [companyAddress, setCompanyAddress] = useState(user.companyAddress);
  const [employeeTotal, setEmployeeTotal] = useState(user.employeeTotal);
  const [website, setWebsite] = useState(user.website);

  useEffect(() => {
    if (!isOpen) return;

    const syncTimer = window.setTimeout(() => {
      setName(user.name);
      setBio(user.bio);
      setGender(user.gender);
      setPhotoUrl(user.photoUrl);
      setCompanyIndustry(user.companyIndustry);
      setCompanyAddress(user.companyAddress);
      setEmployeeTotal(user.employeeTotal);
      setWebsite(user.website);
    }, 0);

    return () => window.clearTimeout(syncTimer);
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handlePhotoChange = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      bio: bio.trim(),
      gender,
      photoUrl,
      companyIndustry: companyIndustry.trim(),
      companyAddress: companyAddress.trim(),
      employeeTotal: employeeTotal.trim(),
      website: website.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 px-4 py-6 flex items-end sm:items-center justify-center">
      <section className="w-full max-w-md max-h-[74vh] rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="shrink-0 p-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-blue-900">{mode === 'company' ? 'Profil Perusahaan' : 'Profil'}</h2>
          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-3">
            {photoUrl ? (
              <Image src={photoUrl} alt="Foto profil" width={64} height={64} className="h-16 w-16 rounded-2xl object-cover border border-gray-200" unoptimized />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-blue-900 text-white flex items-center justify-center text-lg font-bold">
                {getInitials(name)}
              </div>
            )}
            <label className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50">
              Ganti Foto
              <input type="file" accept="image/*" onChange={(event) => handlePhotoChange(event.target.files?.[0])} className="hidden" />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold text-gray-700">Nama</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300"
              placeholder="Nama profil"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-gray-700">Bio</span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300"
              placeholder="Tulis bio singkat"
            />
          </label>

          {mode === 'jobseeker' ? (
            <label className="block">
              <span className="text-xs font-bold text-gray-700">Jenis Kelamin</span>
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300"
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
                <option value="Tidak ingin menyebutkan">Tidak ingin menyebutkan</option>
              </select>
            </label>
          ) : (
            <>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Perusahaan</span>
                <input
                  value={companyIndustry}
                  onChange={(event) => setCompanyIndustry(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300"
                  placeholder="Contoh: Teknologi Informasi"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-700">Alamat Perusahaan</span>
                <input
                  value={companyAddress}
                  onChange={(event) => setCompanyAddress(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300"
                  placeholder="Alamat perusahaan"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-700">Total Karyawan</span>
                <input
                  value={employeeTotal}
                  onChange={(event) => setEmployeeTotal(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300"
                  placeholder="Contoh: 200 karyawan"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-700">Website Perusahaan</span>
                <input
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300"
                  placeholder="contoh.com"
                />
              </label>
            </>
          )}
        </div>

        <div className="shrink-0 grid grid-cols-2 gap-2 border-t border-gray-100 p-4">
          <button type="button" onClick={onClose} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200">
            Batal
          </button>
          <button type="button" onClick={handleSave} disabled={!name.trim()} className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
            Simpan
          </button>
        </div>
      </section>
    </div>
  );
}
