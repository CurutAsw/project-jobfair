import Image from 'next/image';
import type { Candidate } from './data';

export default function CandidateContent({ candidates, query, filter }: { candidates: Candidate[]; query: string; filter: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-blue-900">Cari Kandidat</h1>
        <p className="text-xs text-gray-500 mt-1">Filter aktif: {filter}. {query ? `Pencarian untuk ${query}.` : 'Tampilkan kandidat rekomendasi terbaik.'}</p>
      </div>

      <div className="space-y-3">
        {candidates.map((candidate) => (
          <article key={candidate.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Image src={candidate.avatarUrl} alt={`Foto ${candidate.name}`} width={44} height={44} className="w-11 h-11 rounded-2xl shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-gray-900 truncate">{candidate.name}</h2>
                  <p className="text-xs text-gray-500 truncate">{candidate.role} - {candidate.location} - {candidate.experience}</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-50 text-blue-900 px-2 py-1 text-[11px] font-bold shrink-0">{candidate.match}% cocok</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-gray-100 text-gray-600 px-2.5 py-1 text-[11px] font-semibold">{skill}</span>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs font-semibold text-green-700">{candidate.status}</span>
              <button type="button" className="rounded-lg bg-blue-900 text-white px-3 py-2 text-xs font-bold hover:bg-blue-800">Hubungi</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}