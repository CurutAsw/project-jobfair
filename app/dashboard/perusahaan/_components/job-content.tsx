export default function JobContent() {
  const jobs = [
    { title: 'Frontend Developer', applicants: 38, status: 'Aktif' },
    { title: 'Product Designer', applicants: 24, status: 'Seleksi CV' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Lowongan Perusahaan</h1>
      {jobs.map((job) => (
        <article key={job.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900">{job.title}</h2>
            <p className="text-xs text-gray-500 mt-1">{job.applicants} pelamar - {job.status}</p>
          </div>
          <button type="button" className="rounded-lg bg-gray-100 text-gray-700 px-3 py-2 text-xs font-bold hover:bg-gray-200">Kelola</button>
        </article>
      ))}
    </div>
  );
}