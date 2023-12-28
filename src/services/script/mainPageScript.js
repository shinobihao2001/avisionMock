const scriptLeft = `<div class="elementor-cta__description elementor-cta__content-item elementor-content-item elementor-animated-item--grow">
 Avision cung cấp đầy đủ các loại máy quét chuyên nghiệp
 <br> 
 phù hợp với nhu cầu quét của bạn.</div>`;

const scriptRight = `<div class="elementor-cta__description elementor-cta__content-item elementor-content-item elementor-animated-item--grow"> Tối đa hóa năng suất kinh doanh của bạn 
<br>
với Máy in đa chức năng của Avision.</div>`;

const loginScriptItem = `<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-99999"><a href="/login/" class="elementor-item">Đăng nhập</a></li>`;

const changePassScriptItem = ` 
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-7461">
  <a href="/logout/" class="elementor-item has-submenu" id="sm-17037307890667424-1" aria-haspopup="true" aria-controls="sm-17037307890667424-2" aria-expanded="false">Đăng xuất
  </a>
  <ul class="sub-menu elementor-nav-menu--dropdown sm-nowrap" id="sm-17037307890667424-2" role="group" aria-hidden="true" aria-labelledby="sm-17037307890667424-1" aria-expanded="false" style="width: auto; min-width: 10em; display: none; max-width: 1000px; top: auto; left: 0px; margin-left: 0px; margin-top: 0px;">
    <li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-20505">
      <a href="/reset-password/" class="elementor-sub-item">Đổi mật khẩu</a>
    </li>
  </ul>
  <span class="scroll-up" style="top: auto; left: 0px; margin-left: 0px; width: 180.49px; z-index: 3; display: none;">
    <span class="scroll-up-arrow"></span>
  </span>
  <span class="scroll-down" style="display: none; top: auto; left: 0px; margin-left: 0px; width: 180.49px; z-index: 3;"></span>
</li>`;

const resetPassWordFormScirpt = `
<div id="um_field_99999_user_password" class="um-field um-field-password  um-field-user_password um-field-password um-field-type_password" data-key="user_password">
<div class="um-field-label">
  <label for="user_password_99999">Mật khẩu</label>
  <div class="um-clear"></div>
</div>
<div class="um-field-area">
  <input class="um-form-field valid " type="password" name="user_password-99999" id="user_password_99999" value="" placeholder="" data-validate="" data-key="user_password" aria-invalid="false">
</div>
</div>


<div id="um_field_99999_user_new_password" class="um-field um-field-password  um-field-user_password um-field-password um-field-type_password" data-key="user_new_password">
<div class="um-field-label">
  <label for="user_password_99999">Mật khẩu mới</label>
  <div class="um-clear"></div>
</div>
<div class="um-field-area">
  <input class="um-form-field valid " type="password" name="user_new_password_99999" id="user_new_password_99999" value="" placeholder="" data-validate="" data-key="user_new_password" aria-invalid="false">
</div>
</div>


<div id="um_field_99999_user_password_2" class="um-field um-field-password  um-field-user_password um-field-password um-field-type_password" data-key="user_new_password_2">
<div class="um-field-label">
  <label for="user_password_99999_2">Nhập lại mật khẩu mới</label>
  <div class="um-clear"></div>
</div>
<div class="um-field-area">
  <input class="um-form-field valid " type="password" name="user_new_password_2" id="user_password_99999_2" value="" placeholder="" data-validate="" data-key="user_new_password_2" aria-invalid="false">
</div>
</div>
`;

module.exports = {
  scriptLeft,
  scriptRight,
  loginScriptItem,
  changePassScriptItem,
  resetPassWordFormScirpt,
};
