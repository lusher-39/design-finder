import './globals.css';

export const metadata = {
  title: 'Design Finder',
  description: 'Search and download product designs by name or SKU',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}