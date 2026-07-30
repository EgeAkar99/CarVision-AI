import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateUserBody =
  | {
      action: "update-email";
      email: string;
    }
  | {
      action: "update-password";
      password: string;
    }
  | {
      action: "suspend";
    }
  | {
      action: "unsuspend";
    };

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const adminUser = await requireAdmin();
    const { id } = await context.params;

    if (id === adminUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Kendi admin hesabınız üzerinde bu işlem yapılamaz.",
        },
        { status: 400 },
      );
    }

    const body = (await request.json()) as UpdateUserBody;
    const supabaseAdmin = createAdminClient();

    if (body.action === "update-email") {
      const email = body.email?.trim().toLowerCase();

      if (!email || !email.includes("@")) {
        return NextResponse.json(
          {
            success: false,
            message: "Geçerli bir e-posta adresi girin.",
          },
          { status: 400 },
        );
      }

      const { data, error } =
        await supabaseAdmin.auth.admin.updateUserById(id, {
          email,
          email_confirm: true,
        });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "E-posta adresi değiştirildi.",
        user: data.user,
      });
    }

    if (body.action === "update-password") {
      if (!body.password || body.password.length < 8) {
        return NextResponse.json(
          {
            success: false,
            message: "Şifre en az 8 karakter olmalıdır.",
          },
          { status: 400 },
        );
      }

      const { data, error } =
        await supabaseAdmin.auth.admin.updateUserById(id, {
          password: body.password,
        });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Kullanıcının şifresi değiştirildi.",
        user: data.user,
      });
    }

    if (body.action === "suspend") {
      const { data, error } =
        await supabaseAdmin.auth.admin.updateUserById(id, {
          ban_duration: "876000h",
        });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Kullanıcı hesabı askıya alındı.",
        user: data.user,
      });
    }

    if (body.action === "unsuspend") {
      const { data, error } =
        await supabaseAdmin.auth.admin.updateUserById(id, {
          ban_duration: "none",
        });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Kullanıcı hesabı tekrar etkinleştirildi.",
        user: data.user,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Geçersiz işlem.",
      },
      { status: 400 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.";

    const status =
      message === "Unauthorized"
        ? 401
        : message === "Forbidden"
          ? 403
          : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const adminUser = await requireAdmin();
    const { id } = await context.params;

    if (id === adminUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin hesabı silinemez.",
        },
        { status: 400 },
      );
    }

    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kullanıcı kalıcı olarak silindi.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.";

    const status =
      message === "Unauthorized"
        ? 401
        : message === "Forbidden"
          ? 403
          : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}