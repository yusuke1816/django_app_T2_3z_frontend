// components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-500 py-6  border-t">
      <p>&copy; {new Date().getFullYear()} Money Manager. All rights reserved.</p>
    </footer>
  );
}
