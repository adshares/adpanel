package net.adshares.pages.advertiser;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

/**
 * Page for entering targeting filters (second stage of campaign editing).
 */
public class EditCampaignSummaryPage {

    /**
     * Date pattern used on summary campaign page. It is used as pattern of DateTimeFormatter.
     */
    private static final String DATE_PATTERN = "dd MMM uuuu";

    @FindBy(css = "section.campaign-edit-summary div.campaign-info--primary")
    private WebElement campaignNameText;
    @FindBy(css = "section.campaign-edit-summary > div.adsh-box.adsh-box--large.campaign-edit-summary__basic-info > div:nth-child(3) > div.col-xs-3.campaign-edit-summary__info-cell > p.adsh-copy")
    private WebElement campaignTargetUrl;
    @FindBy(css = "section.campaign-edit-summary > div.adsh-box.adsh-box--large.campaign-edit-summary__basic-info > div:nth-child(3) > div:nth-child(2) > p.adsh-copy")
    private WebElement campaignBidStrategyComplex;
    @FindBy(css = "section.campaign-edit-summary > div.adsh-box.adsh-box--large.campaign-edit-summary__basic-info > div:nth-child(3) > div:nth-child(3) > p.adsh-copy")
    private WebElement campaignBudget;
    @FindBy(css = "section.campaign-edit-summary > div.adsh-box.adsh-box--large.campaign-edit-summary__basic-info > div:nth-child(3) > div:nth-child(4) > p.adsh-copy")
    private WebElement campaignStartDate;
    @FindBy(css = "section.campaign-edit-summary > div.adsh-box.adsh-box--large.campaign-edit-summary__basic-info > div:nth-child(3) > div:nth-child(5) > p.adsh-copy > span")
    private WebElement campaignEndDate;


    @FindBy(css = "section.campaign-edit-summary > div:nth-child(5) > a")
    private WebElement backButton;
    @FindBy(css = "section.campaign-edit-summary > div:nth-child(5) > div > a:nth-child(1)")
    private WebElement saveAsDraftButton;
    @FindBy(css = "section.campaign-edit-summary > div:nth-child(5) > div > a:nth-child(2)")
    private WebElement startCampaignButton;


    private WebDriver driver;
    private WebDriverWait wait;

    public EditCampaignSummaryPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 10);
        PageFactory.initElements(driver, this);
    }

    public void checkCampaignSummary(CampaignBasicInfo info) {
        wait.until(ExpectedConditions.visibilityOf(campaignNameText));

        String name = campaignNameText.getText();
        String targetUrl = campaignTargetUrl.getText();
        String[] bidStrategyArr = campaignBidStrategyComplex.getText().split(" ");

        String bidStrategy = bidStrategyArr[0];
        String bidValue = bidStrategyArr[1].replaceAll("[^\\d.]", "");

        String campaignBudgetText = campaignBudget.getText();
        String budget = campaignBudgetText.replaceAll("[^\\d.]", "");


        String startDateAsString = campaignStartDate.getText();
        String endDateAsString = campaignEndDate.getText();

        LocalDate startDate = null;
        LocalDate endDate = null;

        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN, Locale.US);
        try {
            startDate = LocalDate.parse(startDateAsString, formatter);
        } catch (DateTimeParseException dtpe) {
            System.out.println("EditCampaignSummaryPage: incorrect format of start date");
        }

        if (!"-".equals(endDateAsString)) {
            try {
                endDate = LocalDate.parse(endDateAsString, formatter);
            } catch (DateTimeParseException dtpe) {
                System.out.println("EditCampaignSummaryPage: incorrect format of end date");
            }
        }


        CampaignBasicInfo campInfo = new CampaignBasicInfo(name, targetUrl,
                bidStrategy, bidValue, budget, startDate, endDate);

        // assert campaign basic info
        boolean isEqual = campInfo.equals(info);
        Assert.assertTrue(isEqual);


    }

    public void startCampaignButton() {
        wait.until(ExpectedConditions.visibilityOf(startCampaignButton));
        startCampaignButton.click();
    }

    public void saveDataAsDraft() {
        wait.until(ExpectedConditions.visibilityOf(saveAsDraftButton));
        saveAsDraftButton.click();
    }

    public void goBack() {
        wait.until(ExpectedConditions.visibilityOf(backButton));
        backButton.click();

        driver.switchTo().alert().accept();
    }
}
