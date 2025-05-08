import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    let { name } = params;
    
    // If the name doesn't end with .png, add it
    if (!name.endsWith('.png')) {
      name = name + '.png';
    }
    
    // The URL might have spaces encoded as %20, but S3 URLs need URL encoding
    name = encodeURIComponent(decodeURIComponent(name));
    
    // Create the direct S3 URL (using the simplified SKU naming)
    const url = `https://aspenarlo.s3.us-east-2.amazonaws.com/DesignTiles/${name}`;
    
    // Redirect to the public URL
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Image not found: ' + error.message },
      { status: 404 }
    );
  }
}