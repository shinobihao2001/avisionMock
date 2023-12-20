const script = `<div class="elementor-section elementor-top-section elementor-element elementor-element-505bfda elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default animated fadeIn" data-id="505bfda" data-element_type="section" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;stretch_section&quot;:&quot;section-stretched&quot;}" style="width: 143px; left: 0px;padding-top: 25px">
<div class="elementor-container elementor-column-gap-default">
  <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-6854dc3" data-id="6854dc3" data-element_type="column">
    <div class="elementor-widget-wrap elementor-element-populated">
      <div class="elementor-element elementor-element-d13b3fd elementor-widget elementor-widget-heading" data-id="d13b3fd" data-element_type="widget" data-widget_type="heading.default">
        <div class="elementor-widget-container">
          <h2 class="elementor-heading-title elementor-size-default">▎Đăng ký bảo hành</h3>
        </div>
      </div>
      <div class="elementor-element elementor-element-9e5d34d elementor-widget elementor-widget-text-editor" data-id="9e5d34d" data-element_type="widget" data-widget_type="text-editor.default">
        <div class="elementor-widget-container">
          <p>Đăng ký bảo hành sản phẩm của bạn.Tải lên danh sách số sê-ri,hóa đơn,biên bản giao hàng để xem xét khả năng đủ điều kiện nhận hỗ trợ của bạn.</p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

<!-- Original Section -->
<section class="elementor-section elementor-top-section elementor-element elementor-element-1e178ee elementor-section-boxed elementor-section-height-default elementor-section-height-default animated fadeIn" data-id="1e178ee" data-element_type="section" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;}">
  <div class="elementor-container elementor-column-gap-default">
    <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-ef0d44c" data-id="ef0d44c" data-element_type="column">
      <div class="elementor-widget-wrap elementor-element-populated">
        <div class="elementor-element elementor-element-4edd0b7 elementor-widget elementor-widget-wpforms" data-id="4edd0b7" data-element_type="widget" data-widget_type="wpforms.default">
          <div class="elementor-widget-container">
            <div class="wpforms-container wpforms-container-full" id="wpforms-4192">
              <form id="wpforms-form-4192" class="wpforms-validate wpforms-form" data-formid="4192" method="post" enctype="multipart/form-data" action="/agent/signUpWarranty" data-token="e0bb84edcfe2d9bf1f1a7e751060adb9" novalidate="novalidate">
                <noscript class="wpforms-error-noscript">Please enable JavaScript in your browser to complete this form.</noscript>
                <div class="wpforms-field-container">
                  <!-- Additional field for receipt -->
                  <div>
                    <label class="wpforms-field-label" for="receipt">Chọn ảnh hóa đơn<span class="wpforms-required-label">*</span></label>
                    <input type="file" class="wpforms-field-medium wpforms-field-required" id="receipt" name="receipt" accept=".pdf, .png, .jpg, .jpeg" required>
                  </div>

                  <!-- Additional field for Biên Bản Giao Hàng -->
                  <div id="wpforms-4192-field_2-container" class="wpforms-field wpforms-field-file" data-field-id="2">
                    <label class="wpforms-field-label" for="wpforms-4192-field_2">Biên Bản Giao Hàng <span class="wpforms-required-label">*</span></label>
                    <input type="file" id="wpforms-4192-field_2" class="wpforms-field-medium wpforms-field-required" data-form-id="4192" data-field-id="2" name="wpforms[fields][2]" accept=".pdf, .png, .jpg, .jpeg" required="">
                  </div>

                  <!-- Additional field for Danh sách số seri -->
                  <div id="wpforms-4192-field_3-container" class="wpforms-field wpforms-field-file" data-field-id="3">
                    <label class="wpforms-field-label" for="wpforms-4192-field_3">Danh sách số seri <span class="wpforms-required-label">*</span></label>
                    <input type="file" id="wpforms-4192-field_3" class="wpforms-field-medium wpforms-field-required" data-form-id="4192" data-field-id="3" name="wpforms[fields][3]" accept=".pdf, .png, .jpg, .jpeg" required="">
                  </div>

                </div><!-- .wpforms-field-container -->
                <div class="wpforms-submit-container">
                  <input type="hidden" name="wpforms[id]" value="4192">
                  <input type="hidden" name="wpforms[author]" value="2">
                  <input type="hidden" name="wpforms[post_id]" value="7068">
                  <button type="submit" name="wpforms[submit]" id="wpforms-submit-4192" class="wpforms-submit" data-alt-text="Sending..." data-submit-text="Submit" aria-live="assertive" value="wpforms-submit">Nộp</button>
                </div>
              </form>
            </div> <!-- .wpforms-container -->
          </div>
        </div>
        <div class="elementor-element elementor-element-c12b7ee elementor-widget elementor-widget-shortcode" data-id="c12b7ee" data-element_type="widget" data-widget_type="shortcode.default">
          <div class="elementor-widget-container">
            <div class="elementor-shortcode"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

`;

module.exports = script;
