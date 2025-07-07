// src/lib/fetchWithAuth.ts
export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<any> {
    let access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
  
    const headers = new Headers(options.headers || {});
    if (access) headers.set('Authorization', `Bearer ${access}`);
  
    let res = await fetch(url, { ...options, headers });
  
    if (res.status === 401 && refresh) {
      const refreshRes = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
  
      if (refreshRes.ok) {
        const { access: newAccess } = await refreshRes.json();
        localStorage.setItem('access', newAccess);
  
        headers.set('Authorization', `Bearer ${newAccess}`);
        res = await fetch(url, { ...options, headers });
      } else {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return;
      }
    }
  
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  
    return res.json();
  }
  