package pl.adshares.adpanel.data.campaign;

import java.time.LocalDate;
import java.util.Objects;

public class CampaignBasicInfo {
  private final String name;
  private final String targetUrl;
  private final String Max_CPC;
  private final String Max_CPM;
  private final String ADS_day;
  private final String ADS_hour;
  private final LocalDate startDate;
  private final LocalDate endDate;

  public CampaignBasicInfo(String name, String targetUrl, String Max_CPC, String Max_CPM, String ADS_day, String ADS_hour, LocalDate startDate, LocalDate endDate) {
    this.name = name;
    this.targetUrl = targetUrl;
    this.Max_CPC = Max_CPC;
    this.Max_CPM = Max_CPM;
    this.ADS_day = ADS_day;
    this.ADS_hour = ADS_hour;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public String getName() {
    return name;
  }
  public String getTargetUrl() {
    return targetUrl;
  }
  public String getMax_CPC() {
    return Max_CPC;
  }
  public String getMax_CPM() {
    return Max_CPM;
  }
  public String getADS_day() {
    return ADS_day;
  }
  public String getADS_hour() {
    return ADS_hour;
  }
  public LocalDate getStartDate() {
    return startDate;
  }
  public LocalDate getEndDate() {
    return endDate;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    CampaignBasicInfo that = (CampaignBasicInfo) o;
    return Objects.equals(getName(), that.getName()) &&
      Objects.equals(getTargetUrl(), that.getTargetUrl()) &&
      Objects.equals(getMax_CPC(), that.getMax_CPC()) &&
      Objects.equals(getMax_CPM(), that.getMax_CPM()) &&
      Objects.equals(getADS_day(), that.getADS_day()) &&
      Objects.equals(getADS_hour(), that.getADS_hour()) &&
      getStartDate().isEqual(that.getStartDate()) &&
      ((getEndDate() == null && that.getEndDate() == null) || (getEndDate() != null && that.getEndDate() != null && getEndDate().isEqual(that.getEndDate())));
  }

  @Override
  public int hashCode() {
    return Objects.hash(getName(), getTargetUrl(), getMax_CPC(), getMax_CPM(), getADS_day(), getADS_hour(), getStartDate(), getEndDate());
  }
}
