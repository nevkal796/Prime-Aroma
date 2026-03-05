import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_COOKIE = "admin_session_v2";
// Create a public bucket named "product-images" in Supabase Dashboard → Storage.
const STORAGE_BUCKET = "Product-images";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100) || "image";
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    let name: string;
    let description: string | null = null;
    let price: number;
    let stock = 0;
    let size: string | null = null;
    let brand: string | null = null;
    let image_url: string | null = null;
    let background_image_url: string | null = null;
    let top_notes: string | null = null;
    let middle_notes: string | null = null;
    let base_notes: string | null = null;
    let key_notes: string | null = null;
    let fragrance_family: string | null = null;
    let scent_type: string | null = null;
    let seasons: string[] | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = (formData.get("name") as string)?.trim() ?? "";
      const priceStr = (formData.get("price") as string)?.trim();
      price = parseFloat(priceStr ?? "");
      description = (formData.get("description") as string)?.trim() || null;
      const stockStr = (formData.get("stock") as string)?.trim();
      stock = Math.max(0, parseInt(stockStr ?? "0", 10) || 0);
      size = (formData.get("size") as string)?.trim() || null;
      brand = (formData.get("brand") as string)?.trim() || null;
      top_notes = (formData.get("top_notes") as string)?.trim() || null;
      middle_notes = (formData.get("middle_notes") as string)?.trim() || null;
      base_notes = (formData.get("base_notes") as string)?.trim() || null;
      key_notes = (formData.get("key_notes") as string)?.trim() || null;
      fragrance_family = (formData.get("fragrance_family") as string)?.trim() || null;
      scent_type = (formData.get("scent_type") as string)?.trim() || null;
      const seasonsRaw = (formData.get("seasons") as string) ?? "";
      if (seasonsRaw) {
        try {
          const parsed = JSON.parse(seasonsRaw);
          if (Array.isArray(parsed)) {
            seasons = parsed
              .map((s) => String(s).toLowerCase())
              .filter(Boolean);
          }
        } catch {
          seasons = null;
        }
      }

      const file = formData.get("image") as File | null;
      if (file && file.size > 0 && file.type.startsWith("image/")) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${Date.now()}-${sanitizeFileName(file.name)}.${ext}`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, {
            contentType: file.type,
            upsert: false,
          });
        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          return NextResponse.json(
            { error: "Image upload failed. Create a public bucket named 'product-images' in Supabase Storage." },
            { status: 500 }
          );
        }
        const { data: urlData } = supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
      const bgFile = formData.get("background_image") as File | null;
      if (bgFile && bgFile.size > 0 && bgFile.type.startsWith("image/")) {
        const ext = bgFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const bgPath = `bg_${Date.now()}-${sanitizeFileName(bgFile.name)}.${ext}`;
        const { error: bgUploadError } = await supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .upload(bgPath, bgFile, { contentType: bgFile.type, upsert: false });
        if (!bgUploadError) {
          const { data: bgUrlData } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(bgPath);
          background_image_url = bgUrlData.publicUrl;
        }
      }
    } else {
      const body = await request.json();
      const b = body as {
        name?: string;
        description?: string | null;
        price?: number;
        image_url?: string | null;
        background_image_url?: string | null;
        stock?: number;
        size?: string | null;
        brand?: string | null;
        top_notes?: string | null;
        middle_notes?: string | null;
        base_notes?: string | null;
        key_notes?: string | null;
        fragrance_family?: string | null;
        scent_type?: string | null;
        seasons?: string[] | null;
      };
      name = b.name?.trim() ?? "";
      price = Number(b.price);
      description = b.description?.trim() || null;
      image_url = b.image_url?.trim() || null;
      background_image_url = b.background_image_url?.trim() || null;
      stock = Math.max(0, Number(b.stock) || 0);
      size = b.size?.trim() || null;
      brand = b.brand?.trim() || null;
      top_notes = b.top_notes?.trim() || null;
      middle_notes = b.middle_notes?.trim() || null;
      base_notes = b.base_notes?.trim() || null;
      key_notes = b.key_notes?.trim() || null;
      fragrance_family = b.fragrance_family?.trim() || null;
      scent_type = b.scent_type?.trim() || null;
      if (Array.isArray(b.seasons)) {
        seasons = b.seasons.map((s) => String(s).toLowerCase()).filter(Boolean);
      }
    }

    if (!name || Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Name and valid price are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.from("products").insert([
      {
        name,
        description,
        price,
        image_url,
        background_image_url,
        stock,
        size,
        brand,
        top_notes,
        middle_notes,
        base_notes,
        key_notes,
        fragrance_family,
        scent_type,
        seasons,
      },
    ]).select("id, name, created_at")
      .single();

    if (error) {
      console.error("Admin product insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Admin products POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    let id: string;
    let name: string;
    let description: string | null = null;
    let price: number;
    let stock = 0;
    let size: string | null = null;
    let brand: string | null = null;
    let image_url: string | null = null;
    let imageReplace = false;
    let background_image_url: string | null = null;
    let backgroundImageReplace = false;
    let top_notes: string | null = null;
    let middle_notes: string | null = null;
    let base_notes: string | null = null;
    let key_notes: string | null = null;
    let fragrance_family: string | null = null;
    let scent_type: string | null = null;
    let seasons: string[] | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = (formData.get("id") as string)?.trim() ?? "";
      name = (formData.get("name") as string)?.trim() ?? "";
      const priceStr = (formData.get("price") as string)?.trim();
      price = parseFloat(priceStr ?? "");
      description = (formData.get("description") as string)?.trim() || null;
      const stockStr = (formData.get("stock") as string)?.trim();
      stock = Math.max(0, parseInt(stockStr ?? "0", 10) || 0);
      size = (formData.get("size") as string)?.trim() || null;
      brand = (formData.get("brand") as string)?.trim() || null;
      top_notes = (formData.get("top_notes") as string)?.trim() || null;
      middle_notes = (formData.get("middle_notes") as string)?.trim() || null;
      base_notes = (formData.get("base_notes") as string)?.trim() || null;
      key_notes = (formData.get("key_notes") as string)?.trim() || null;
      fragrance_family = (formData.get("fragrance_family") as string)?.trim() || null;
      scent_type = (formData.get("scent_type") as string)?.trim() || null;
      const seasonsRaw = (formData.get("seasons") as string) ?? "";
      if (seasonsRaw) {
        try {
          const parsed = JSON.parse(seasonsRaw);
          if (Array.isArray(parsed)) {
            seasons = parsed
              .map((s) => String(s).toLowerCase())
              .filter(Boolean);
          }
        } catch {
          seasons = null;
        }
      }
      const removeImage = (formData.get("removeImage") as string) === "1";
      if (removeImage) {
        image_url = null;
        imageReplace = true;
      }

      const file = formData.get("image") as File | null;
      if (file && file.size > 0 && file.type.startsWith("image/")) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${Date.now()}-${sanitizeFileName(file.name)}.${ext}`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, {
            contentType: file.type,
            upsert: false,
          });
        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          return NextResponse.json(
            { error: "Image upload failed." },
            { status: 500 }
          );
        }
        const { data: urlData } = supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(path);
        image_url = urlData.publicUrl;
        imageReplace = true;
      }
      const bgFile = formData.get("background_image") as File | null;
      if (bgFile && bgFile.size > 0 && bgFile.type.startsWith("image/")) {
        const ext = bgFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const bgPath = `bg_${Date.now()}-${sanitizeFileName(bgFile.name)}.${ext}`;
        const { error: bgUploadError } = await supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .upload(bgPath, bgFile, { contentType: bgFile.type, upsert: false });
        if (!bgUploadError) {
          const { data: bgUrlData } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(bgPath);
          background_image_url = bgUrlData.publicUrl;
          backgroundImageReplace = true;
        }
      }
      const removeBgImage = (formData.get("removeBackgroundImage") as string) === "1";
      if (removeBgImage) {
        background_image_url = null;
        backgroundImageReplace = true;
      }
    } else {
      const body = await request.json();
      const b = body as {
        id: string;
        name?: string;
        description?: string | null;
        price?: number;
        image_url?: string | null;
        stock?: number;
        size?: string | null;
        brand?: string | null;
        top_notes?: string | null;
        middle_notes?: string | null;
        base_notes?: string | null;
        key_notes?: string | null;
        fragrance_family?: string | null;
        scent_type?: string | null;
        seasons?: string[] | null;
      };
      id = b.id?.trim() ?? "";
      name = b.name?.trim() ?? "";
      price = Number(b.price);
      description = b.description?.trim() || null;
      image_url = b.image_url?.trim() || null;
      stock = Math.max(0, Number(b.stock) || 0);
      size = b.size?.trim() || null;
      brand = b.brand?.trim() || null;
      top_notes = b.top_notes?.trim() || null;
      middle_notes = b.middle_notes?.trim() || null;
      base_notes = b.base_notes?.trim() || null;
      key_notes = b.key_notes?.trim() || null;
      fragrance_family = b.fragrance_family?.trim() || null;
      scent_type = b.scent_type?.trim() || null;
      if (Array.isArray(b.seasons)) {
        seasons = b.seasons.map((s) => String(s).toLowerCase()).filter(Boolean);
      }
      imageReplace = true;
    }

    if (!id || !name || Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Id, name, and valid price are required" },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      name,
      description,
      price,
      stock,
      size,
      brand,
      top_notes,
      middle_notes,
      base_notes,
      key_notes,
      fragrance_family,
      scent_type,
      seasons,
    };
    if (imageReplace) {
      updatePayload.image_url = image_url;
    }
    if (backgroundImageReplace) {
      updatePayload.background_image_url = background_image_url;
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updatePayload)
      .eq("id", id)
      .select("id, name, created_at")
      .single();

    if (error) {
      console.error("Admin product update error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Admin products PATCH error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Product id is required" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    console.error("Admin product delete error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
