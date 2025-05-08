# Design Finder

A Next.js application for Aspen & Arlo (A&A) to manage product designs. The app allows users to:
- Search for products by name or SKU
- View product images from AWS S3
- Rename products
- Download product design images

## Migration from JSON to Supabase

This application has been updated to use Supabase for data storage instead of a local JSON file. This solves the issue with Vercel's read-only filesystem in production.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:
```
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
BUCKET_NAME=aspenarlo

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gnqghlnartzxlxutlpvc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
npm run dev
```

## Supabase Database Schema

The Supabase database contains a `products` table with the following schema:

| Column Name   | Type      | Description                       |
|---------------|-----------|-----------------------------------|
| id            | uuid      | Primary key                       |
| product_name  | text      | Name of the product               |
| sku_6ft       | text      | 6ft SKU                           |
| sku_15ft      | text      | 15ft SKU                          |
| image_path    | text      | Path to the image in S3           |
| created_at    | timestamp | When the record was created       |

## API Routes

- `/api/search`: Searches for products by name or SKU using Supabase
- `/api/rename-product`: Updates a product's name in Supabase
- `/api/image/[name]`: Retrieves a product image from AWS S3
- `/api/test-supabase`: Tests the connection to Supabase

## Image Storage

Product images are stored in an AWS S3 bucket (`aspenarlo`) in the `DesignTiles/` folder. The image filenames are based on the first 8 characters of the 6ft SKU.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_KEY`: Your AWS secret key
- `AWS_REGION`: The AWS region of your S3 bucket
- `BUCKET_NAME`: The name of your S3 bucket

## Data Transformation

The API routes handle the transformation between the Supabase database format and the frontend format:

Supabase format:
```json
{
  "id": "uuid",
  "product_name": "Product Name",
  "sku_6ft": "AA12345606",
  "sku_15ft": "AA12345615",
  "image_path": "Product Name.png",
  "created_at": "timestamp"
}
```

Frontend format:
```json
{
  "productName": "Product Name",
  "sku6ft": "AA12345606",
  "sku15ft": "AA12345615",
  "imagePath": "Product Name.png"
}
```