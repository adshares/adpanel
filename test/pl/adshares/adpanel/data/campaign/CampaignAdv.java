package pl.adshares.adpanel.data.campaign;

public class CampaignAdv {

  public static final String TYPE_HTML = "html";
  public static final String TYPE_IMAGE = "image";
  private final String headline;
  private final String type;
  /**
   * Depending on AdvertisementType, resource is:
   * <ul>
   * <li>html code, when it is HTML,</li>
   * <li>absolute path to image file, when it is IMAGE.</li>
   * </ul>
   */
  private final String size;
  private final String resource;


  /**
   * @param headline advertisement headline
   * @param type     "html" or "image"
   * @param size     size of advertisement, eg. "300x100"
   * @param resource html code, when type is "html"; absolute path to image file, when it is "image"
   */
  public CampaignAdv(String headline, String type, String size, String resource ) {
    this.headline = headline;
    this.type = type;
    this.size = size;
    this.resource = resource;
  }

  public String getHeadline() {
    return headline;
  }

  public String getType() {
    return type;
  }

  public String getSize() {
    return size;
  }

  public String getResource() {
    return resource;
  }


}
