from flask import Flask, render_template
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn import manifold, preprocessing
app = Flask(__name__)


@app.route('/')
def index():  # put application's code here
    data= pd.read_csv('finalcsv.csv')
    label_encoder = preprocessing.LabelEncoder()
    df = data.copy()
    df = df.dropna()
    category = ["Customer_Age", "Gender", "Dependent_count", "Education_Level", "Marital_Status", "Income_Category",
                "Card_Category", "Total_Relationship_Count", "Months_Inactive", "Contacts_Count","State"]
    for i in category:
        df[i] = label_encoder.fit_transform(df[i])
    columns=["Customer_Age","Gender","Dependent_count","Education_Level","Marital_Status","Income_Category","Card_Category","Months_on_book","Total_Relationship_Count","Months_Inactive","Contacts_Count","Credit_Limit","Total_Revolving_Bal","Avg_Open_To_Buy","Total_Trans_Amt","Total_Trans_Ct","State"]
    df=df[columns]
    df=df.dropna()

    # scaler = StandardScaler()
    # scaler.fit(data)
    # scaledData = scaler.transform(data)
    # scaledDataFrame = pd.DataFrame(scaledData,columns=columns)

    dataKmeans = calculateKmeans(df, 3)

    data_stored = list()
    data_stored.append(dataKmeans.labels_.tolist())
    return render_template('index.html', data=data_stored)

# @app.route("/get_PCP_data/<state>")
# def get_PCP_data(state):
#     global df
#     new_df=df.loc[df['points'] == 7]
#     dataKmeans=calculateKmeans(new_df,3)
#     return render_template('index.html', data=dataKmeans)


def calculateKmeans(data,k):
    kmeans = KMeans(n_clusters=k, random_state=0).fit(data)
    return kmeans

if __name__ == '__main__':
    app.run(debug=True)
