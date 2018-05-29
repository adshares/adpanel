package pl.adshares.adpanel.tools;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

public class FileOperation {
  public static String readSingleValue(String path) {
    try (BufferedReader bufferedReader = new BufferedReader
      (new InputStreamReader(new FileInputStream(path), StandardCharsets.UTF_8))) {
      return bufferedReader.readLine();
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static void writeSingleValueWithNoAppend(String path, String singleData) {
    try (BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(
      new FileOutputStream(new File(path), false), StandardCharsets.UTF_8))) {
      bufferedWriter.write(singleData.trim());
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static void writeSingleWithDataAppend(String path, String singleData) {
    try (BufferedWriter bufferedWriter
           = new BufferedWriter(new OutputStreamWriter(
      new FileOutputStream(new File(path), true), StandardCharsets.UTF_8))) {
      bufferedWriter.write(singleData);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static String[] getRowAndDelete(String path) {

    File file = new File(path);

    String data;
    ArrayList<String> arrayList = new ArrayList<>();
    try (BufferedReader bufferedReader = new BufferedReader(
      new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {

      String currentLine;

      while ((currentLine = bufferedReader.readLine()) != null) {
        data = currentLine.trim();
        arrayList.add(data);
      }

    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    if (arrayList.size() > 0) {

      try (BufferedWriter bufferedWriter
             = new BufferedWriter(new OutputStreamWriter(
        new FileOutputStream(new File(path)), StandardCharsets.UTF_8))) {

        for (int i = 1; i < arrayList.size(); i++) {
          bufferedWriter.write(arrayList.get(i) + "\n");
        }

      } catch (IOException e) {
        throw new RuntimeException(e);
      }
      return arrayList.get(0).split(";");
    } else {
      return new String[]{"Brak danych w pliku"};
    }
  }
}
